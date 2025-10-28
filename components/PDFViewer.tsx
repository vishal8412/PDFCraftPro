"use client";
/// <reference types="pdfjs-dist" />

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
} from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { useVirtualizer } from "@tanstack/react-virtual";
import "../styles/globals.css";

/* === pdf.js worker === */
const workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerSrc;

/* ========= Types ========= */
export type Tool = "draw" | "highlight" | "text" | null;

type StrokePoint = { xPct: number; yPct: number };
type Stroke = {
  id: number;
  page: number;
  points: StrokePoint[];
  color: string;
  width: number; // px at 100% zoom
};

type Highlight = {
  id: number;
  page: number;
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  color: string;
  opacity: number;
};

type HistoryAction =
  | { kind: "add-stroke"; stroke: Stroke }
  | { kind: "remove-stroke"; stroke: Stroke }
  | { kind: "add-highlight"; highlight: Highlight }
  | { kind: "remove-highlight"; highlight: Highlight };

export type PDFViewerHandle = {
  prev: () => void;
  next: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  goToPage: (n: number) => void;
  getState: () => { currentPage: number | null; totalPages: number; scale: number };
  undo: () => void;
  redo: () => void;
};

interface PDFViewerProps {
  fileUrl: string;
  scale: number;
  /** "draw" | "highlight" | "text" | null */
  activeTool?: Tool;
  onStateChange?: (s: {
    currentPage: number | null;
    totalPages: number;
    scale: number;
    fileLoaded: boolean;
  }) => void;
  onThumbnailsChange?: (
    items: { id: string; pageNum: number; thumb?: string }[],
    progress: number
  ) => void;
}

/* ========= Component ========= */
const PDFViewer = forwardRef<PDFViewerHandle, PDFViewerProps>(
  ({ fileUrl, scale, activeTool = null, onStateChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState<number | null>(null);
    const [pageHeights, setPageHeights] = useState<number[]>([]);
    const [zoom, setZoom] = useState(scale || 1);
    const [rotation, setRotation] = useState(0);

    /** Text layer (per page, absolute to page box in CSS px; ok because we keep them visually on top) */
    const [editedTexts, setEditedTexts] = useState<
      { id: number; page: number; text: string; x: number; y: number; fontSize: number; color: string }[]
    >([]);

    /** Vector layers (normalized to page size so they scale with zoom) */
    const [strokesByPage, setStrokesByPage] = useState<Record<number, Stroke[]>>({});
    const [highlightsByPage, setHighlightsByPage] = useState<Record<number, Highlight[]>>({});

    /** Simple history stacks */
    const history = useRef<HistoryAction[]>([]);
    const redoStack = useRef<HistoryAction[]>([]);

    /* === Notify parent === */
    useEffect(() => {
      onStateChange?.({
        currentPage,
        totalPages: pageCount,
        scale: zoom,
        fileLoaded: !!pdfDoc,
      });
    }, [currentPage, pageCount, zoom, pdfDoc, onStateChange]);

    /* === Load PDF === */
    useEffect(() => {
      if (!fileUrl) {
        setPdfDoc(null);
        setPageCount(0);
        setCurrentPage(null);
        setPageHeights([]);
        setStrokesByPage({});
        setHighlightsByPage({});
        setEditedTexts([]);
        history.current = [];
        redoStack.current = [];
        return;
      }

      const loadPdf = async () => {
        try {
          const loadingTask = (pdfjsLib as any).getDocument(fileUrl);
          const pdf: PDFDocumentProxy = await loadingTask.promise;
          setPdfDoc(pdf);
          setPageCount(pdf.numPages);
          setCurrentPage(1);
        } catch (err) {
          console.error("Error loading PDF:", err);
        }
      };

      loadPdf();
    }, [fileUrl]);

    /* === Virtualizer === */
    const rowVirtualizer = useVirtualizer({
      count: pageCount,
      getScrollElement: () => containerRef.current,
      estimateSize: (i) => pageHeights[i] || 1014,
      overscan: 5,
    });

    const goToPage = (page: number) => {
      if (!pageCount) return;
      const clamped = Math.max(1, Math.min(pageCount, page));
      setCurrentPage(clamped);
      rowVirtualizer.scrollToIndex(clamped - 1, { align: "start" });
    };

    /* === Expose API === */
    useImperativeHandle(ref, () => ({
      prev: () => goToPage(Math.max(1, (currentPage || 1) - 1)),
      next: () => goToPage(Math.min(pageCount, (currentPage || 1) + 1)),
      zoomIn: () => setZoom((z) => Math.min(z + 0.2, 3)),
      zoomOut: () => setZoom((z) => Math.max(z - 0.2, 0.5)),
      rotateLeft: () => setRotation((r) => (r - 90) % 360),
      rotateRight: () => setRotation((r) => (r + 90) % 360),
      goToPage: (n: number) => goToPage(n),
      getState: () => ({ currentPage, totalPages: pageCount, scale: zoom }),
      undo: () => {
        const action = history.current.pop();
        if (!action) return;
        redoStack.current.push(action);

        if (action.kind === "add-stroke") {
          setStrokesByPage((m) => {
            const arr = (m[action.stroke.page] || []).filter((s) => s.id !== action.stroke.id);
            return { ...m, [action.stroke.page]: arr };
          });
        } else if (action.kind === "add-highlight") {
          setHighlightsByPage((m) => {
            const arr = (m[action.highlight.page] || []).filter((h) => h.id !== action.highlight.id);
            return { ...m, [action.highlight.page]: arr };
          });
        } else if (action.kind === "remove-stroke") {
          setStrokesByPage((m) => {
            const arr = [...(m[action.stroke.page] || []), action.stroke];
            return { ...m, [action.stroke.page]: arr };
          });
        } else if (action.kind === "remove-highlight") {
          setHighlightsByPage((m) => {
            const arr = [...(m[action.highlight.page] || []), action.highlight];
            return { ...m, [action.highlight.page]: arr };
          });
        }
      },
      redo: () => {
        const action = redoStack.current.pop();
        if (!action) return;
        history.current.push(action);

        if (action.kind === "add-stroke") {
          setStrokesByPage((m) => {
            const arr = [...(m[action.stroke.page] || []), action.stroke];
            return { ...m, [action.stroke.page]: arr };
          });
        } else if (action.kind === "add-highlight") {
          setHighlightsByPage((m) => {
            const arr = [...(m[action.highlight.page] || []), action.highlight];
            return { ...m, [action.highlight.page]: arr };
          });
        } else if (action.kind === "remove-stroke") {
          setStrokesByPage((m) => {
            const arr = (m[action.stroke.page] || []).filter((s) => s.id !== action.stroke.id);
            return { ...m, [action.stroke.page]: arr };
          });
        } else if (action.kind === "remove-highlight") {
          setHighlightsByPage((m) => {
            const arr = (m[action.highlight.page] || []).filter((h) => h.id !== action.highlight.id);
            return { ...m, [action.highlight.page]: arr };
          });
        }
      },
    }));

    /* === Add Text (only when activeTool === "text") === */
    const pageContainerRef = useRef<HTMLDivElement>(null);
    const handleAddText = (e: React.MouseEvent) => {
      if (activeTool !== "text") return;
      if (!currentPage) return;

      const rect = pageContainerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setEditedTexts((prev) => [
        ...prev,
        {
          id: Date.now(),
          page: currentPage,
          text: "New Text",
          x,
          y,
          fontSize: 14,
          color: "#000",
        },
      ]);
    };

    const handleTextChange = (id: number, newValue: string) => {
      setEditedTexts((prev) => prev.map((t) => (t.id === id ? { ...t, text: newValue } : t)));
    };
    const handleDeleteText = (id: number) => {
      setEditedTexts((prev) => prev.filter((t) => t.id !== id));
    };

    /* === Helpers (history push) === */
    const pushHistory = (a: HistoryAction) => {
      history.current.push(a);
      redoStack.current = [];
    };

    return (
      <div className="flex w-full h-full overflow-hidden relative">
        <div
          ref={containerRef}
          className="flex-1 bg-[#0f141c] relative custom-scrollbar overflow-y-auto overflow-x-hidden"
        >
          <div
            ref={pageContainerRef}
            onClick={(e) => {
              if (activeTool === "text") handleAddText(e);
            }}
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: "100%",
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex justify-center"
              >
                <PageRenderer
                  pageNum={virtualRow.index + 1}
                  pdfDoc={pdfDoc}
                  scale={zoom}
                  rotation={rotation}
                  setCurrentPage={setCurrentPage}
                  setPageHeights={setPageHeights}
                  rowVirtualizer={rowVirtualizer}
                  /* tools */
                  activeTool={activeTool}
                  strokes={strokesByPage[virtualRow.index + 1] || []}
                  highlights={highlightsByPage[virtualRow.index + 1] || []}
                  onStrokeComplete={(stroke) => {
                    setStrokesByPage((m) => ({
                      ...m,
                      [stroke.page]: [...(m[stroke.page] || []), stroke],
                    }));
                    pushHistory({ kind: "add-stroke", stroke });
                  }}
                  onHighlightComplete={(hl) => {
                    setHighlightsByPage((m) => ({
                      ...m,
                      [hl.page]: [...(m[hl.page] || []), hl],
                    }));
                    pushHistory({ kind: "add-highlight", highlight: hl });
                  }}
                  onRemoveStroke={(id) => {
                    const page = virtualRow.index + 1;
                    setStrokesByPage((m) => {
                      const victim = (m[page] || []).find((s) => s.id === id);
                      if (victim) pushHistory({ kind: "remove-stroke", stroke: victim });
                      return { ...m, [page]: (m[page] || []).filter((s) => s.id !== id) };
                    });
                  }}
                  onRemoveHighlight={(id) => {
                    const page = virtualRow.index + 1;
                    setHighlightsByPage((m) => {
                      const victim = (m[page] || []).find((h) => h.id === id);
                      if (victim) pushHistory({ kind: "remove-highlight", highlight: victim });
                      return { ...m, [page]: (m[page] || []).filter((h) => h.id !== id) };
                    });
                  }}
                />
              </div>
            ))}

            {/* Text layer (global over pages; still positions correctly because each page is inside flow) */}
            {editedTexts.map((t) => (
              <div
                key={t.id}
                contentEditable={activeTool === "text"}
                suppressContentEditableWarning
                onInput={(e) => handleTextChange(t.id, (e.target as HTMLElement).innerText)}
                onDoubleClick={() => handleDeleteText(t.id)}
                className="absolute pointer-events-auto select-text text-black bg-yellow-50/60 rounded px-1"
                style={{
                  top: `${t.y}px`,
                  left: `${t.x}px`,
                  fontSize: `${t.fontSize}px`,
                  fontFamily: "sans-serif",
                  color: t.color,
                  minWidth: "40px",
                  cursor: activeTool === "text" ? "text" : "default",
                }}
              >
                {t.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default PDFViewer;

/* ========= PageRenderer with Draw/Highlight overlays ========= */
function PageRenderer({
  pageNum,
  pdfDoc,
  scale,
  rotation,
  setCurrentPage,
  setPageHeights,
  rowVirtualizer,
  /* tools */
  activeTool,
  strokes,
  highlights,
  onStrokeComplete,
  onHighlightComplete,
  onRemoveStroke,
  onRemoveHighlight,
}: any) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  /* draw state */
  const drawing = useRef<StrokePoint[] | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);

  /* highlight state */
  const hlStart = useRef<StrokePoint | null>(null);
  const [previewRect, setPreviewRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const pointerEnabled = activeTool === "draw" || activeTool === "highlight";

  useEffect(() => {
    let cancelled = false;
    let renderTask: any = null;

    const renderPage = async () => {
      if (!pdfDoc) return;
      try {
        const page = await pdfDoc.getPage(pageNum);
        if (cancelled) return;

        const viewport = page.getViewport({ scale, rotation });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.round(viewport.width * outputScale);
        canvas.height = Math.round(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        setSize({ w: viewport.width, h: viewport.height });

        const transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined;

        if (renderTask?.cancel) renderTask.cancel();
        renderTask = page.render({ canvasContext: ctx as any, viewport, transform });
        await renderTask.promise;

        if (!cancelled) {
          setPageHeights((prev: number[]) => {
            const nh = [...prev];
            nh[pageNum - 1] = viewport.height + 40;
            return nh;
          });
          requestAnimationFrame(() => rowVirtualizer.measure());
          setIsVisible(true);
          setCurrentPage((p: number | null) => (p == null ? pageNum : p));
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn("Render_error:", err);
        }
      }
    };

    renderPage();
    return () => {
      cancelled = true;
      if (renderTask?.cancel) renderTask.cancel();
    };
  }, [pdfDoc, pageNum, scale, rotation, rowVirtualizer, setCurrentPage, setPageHeights]);

  /* ====== Pointer handlers ====== */
  const toPct = (x: number, y: number): StrokePoint => ({
    xPct: size.w ? x / size.w : 0,
    yPct: size.h ? y / size.h : 0,
  });

  const fromPct = (p: StrokePoint) => ({
    x: p.xPct * size.w,
    y: p.yPct * size.h,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    if (!pointerEnabled) return;
    if (!overlayRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsPointerDown(true);

    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "draw") {
      drawing.current = [toPct(x, y)];
    } else if (activeTool === "highlight") {
      hlStart.current = toPct(x, y);
      setPreviewRect({ x, y, w: 0, h: 0 });
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown || !overlayRef.current) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === "draw" && drawing.current) {
      drawing.current.push(toPct(x, y));
      // live preview via re-render path -> we just let SVG path render from points array (below)
    } else if (activeTool === "highlight" && hlStart.current) {
      const sx = hlStart.current.xPct * size.w;
      const sy = hlStart.current.yPct * size.h;
      setPreviewRect({
        x: Math.min(sx, x),
        y: Math.min(sy, y),
        w: Math.abs(x - sx),
        h: Math.abs(y - sy),
      });
    }
  };

  const onPointerUp = () => {
    if (!isPointerDown) return;
    setIsPointerDown(false);

    if (activeTool === "draw" && drawing.current?.length) {
      const stroke: Stroke = {
        id: Date.now(),
        page: pageNum,
        points: drawing.current,
        color: "#ff9a3d",
        width: 2,
      };
      drawing.current = null;
      onStrokeComplete?.(stroke);
    } else if (activeTool === "highlight" && hlStart.current && previewRect) {
      const rect = previewRect;
      const hl: Highlight = {
        id: Date.now(),
        page: pageNum,
        xPct: rect.x / size.w,
        yPct: rect.y / size.h,
        wPct: rect.w / size.w,
        hPct: rect.h / size.h,
        color: "#ffe08a",
        opacity: 0.4,
      };
      hlStart.current = null;
      setPreviewRect(null);
      onHighlightComplete?.(hl);
    }
  };

  /* ====== Render ====== */
  const strokePathD = (pts: StrokePoint[]) => {
    if (!pts.length) return "";
    const p0 = fromPct(pts[0]);
    let d = `M ${p0.x} ${p0.y}`;
    for (let i = 1; i < pts.length; i++) {
      const p = fromPct(pts[i]);
      d += ` L ${p.x} ${p.y}`;
    }
    return d;
  };

  return (
    <div
      className={`relative transition-all duration-500 ease-out transform bg-[#fdfdfb] border border-gray-300 rounded-lg overflow-hidden flex justify-center shadow-md ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
      }`}
      style={{ width: size.w || undefined }}
    >
      <div className="relative" style={{ width: size.w || "auto", height: size.h || "auto" }}>
        <canvas ref={canvasRef} className="block" />

        {/* Overlay for tools */}
        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{ pointerEvents: pointerEnabled ? "auto" : "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* SVG vector layer */}
          <svg className="absolute inset-0 w-full h-full overflow-visible">
            {/* existing strokes */}
            {strokes.map((s: Stroke) => (
              <path
                key={s.id}
                d={strokePathD(s.points)}
                stroke={s.color}
                strokeWidth={s.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                onDoubleClick={() => onRemoveStroke?.(s.id)}
                style={{ cursor: "pointer" }}
              />
            ))}

            {/* live stroke preview */}
            {activeTool === "draw" && drawing.current && (
              <path
                d={strokePathD(drawing.current)}
                stroke="#ff9a3d"
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* existing highlights */}
            {highlights.map((h: Highlight) => (
              <rect
                key={h.id}
                x={h.xPct * size.w}
                y={h.yPct * size.h}
                width={h.wPct * size.w}
                height={h.hPct * size.h}
                fill={h.color}
                opacity={h.opacity}
                rx={4}
                onDoubleClick={() => onRemoveHighlight?.(h.id)}
                style={{ cursor: "pointer" }}
              />
            ))}

            {/* live highlight preview */}
            {activeTool === "highlight" && previewRect && (
              <rect
                x={previewRect.x}
                y={previewRect.y}
                width={previewRect.w}
                height={previewRect.h}
                fill="#ffe08a"
                opacity={0.35}
                rx={4}
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
