"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import PDFViewer, { PDFViewerHandle } from "./PDFViewer";
import type { Tool } from "./PDFViewer"; // ⬅️ import the exported type
import BrandedLoader from "./BrandedLoader";
import CollapsiblePanel from "./CollapsiblePanel";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiZoomIn,
  FiZoomOut,
  FiEdit3,
  FiType,
  FiMoreHorizontal,
  FiRotateCcw,
  FiRotateCw,
  FiDownload,
  FiUpload,
  FiPenTool,
  FiFileText,
  FiSettings,
  FiX,
} from "react-icons/fi";

type ThumbItem = { id: string; pageNum: number; thumb?: string };

export default function EditorLayout() {
  const [fileUrl, setFileUrl] = useState("");
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);

  const [activeTool, setActiveTool] = useState<Tool>(null); // ⬅️ narrowed type

  const [viewerState, setViewerState] = useState({
    currentPage: 1,
    totalPages: 0,
    scale: 1.0,
    fileLoaded: false,
  });

  // Left Sidebar — Pages Panel
  const [isPagesOpen, setIsPagesOpen] = useState(false);

  // thumbnails for LEFT sidebar (provided by PDFViewer)
  const [thumbnails, setThumbnails] = useState<ThumbItem[]>([]);
  const [thumbProgress, setThumbProgress] = useState(0);

  // mobile / tablet drawers
  const [showPagesDrawer, setShowPagesDrawer] = useState(false);
  const [showPropsDrawer, setShowPropsDrawer] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<PDFViewerHandle>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      setScale(1.2);
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    if (!fileUrl) {
      setLoading(false);
      setThumbnails([]);
      setThumbProgress(0);
    }
  }, [fileUrl]);

  // Strongly-typed toolbar items
  const TOOL_ITEMS = [
    { id: "draw", icon: <FiEdit3 />, title: "Draw" },
    { id: "text", icon: <FiType />, title: "Text" },
    { id: "highlight", icon: <FiPenTool />, title: "Highlight" },
  ] as const satisfies ReadonlyArray<{ id: Tool; icon: JSX.Element; title: string }>;

  const toggleTool = (tool: Tool) => {
    setActiveTool((prev) => (prev === tool ? null : tool));
  };

  const isActive = (tool: Tool) => activeTool === tool;

  const activeStyle = (tool: Tool) =>
    isActive(tool)
      ? "relative bg-[#1c2534] border border-[#FF9A3D]/80 text-[#FF9A3D] scale-110 shadow-[0_0_12px_rgba(255,154,61,0.4)] animate-floatGlow"
      : "border-transparent text-gray-300 hover:bg-[#1c2432]";

  // Drawer animations
  const drawerVariants: Variants = {
    hiddenLeft: { x: -400, opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
    showLeft: { x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } },
    hiddenRight: { x: 400, opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
    showRight: { x: 0, opacity: 1, transition: { duration: 0.25, ease: "easeInOut" } },
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b111a] text-white overflow-hidden">
      {/* === Navbar === */}
      <Navbar
        showUpload
        fileLoaded={!!fileUrl}
        onUploadClick={() => fileInputRef.current?.click()}
        toolbarVisible={showToolbar}
        onToggleToolbar={() => setShowToolbar((prev) => !prev)}
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
      />

      {/* Loader */}
      {loading && <BrandedLoader message="Loading your document..." fullScreen />}

      {/* === Top Toolbar (only when PDF loaded) === */}
      {fileUrl && (
        <div
          className={`fixed top-[64px] left-0 right-0 z-30 bg-[#121a25] border-b border-[#1f2a38] 
          shadow-[0_2px_8px_rgba(0,0,0,0.45)] px-3 md:px-6 transition-all duration-300 overflow-hidden ${
            showToolbar
              ? "h-[56px] opacity-100 translate-y-0"
              : "h-0 opacity-0 -translate-y-3 border-transparent shadow-none"
          }`}
        >
          <div className="flex items-center justify-between w-full h-full">
            {/* Left: navigation + zoom */}
            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-2 md:gap-3 text-gray-300">
                <button
                  aria-label="Previous page"
                  className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                  onClick={() => viewerRef.current?.prev()}
                >
                  <FiArrowLeft />
                </button>

                <span className="text-xs md:text-sm font-medium whitespace-nowrap">
                  Page {viewerState.currentPage} / {viewerState.totalPages || "—"}
                </span>

                <button
                  aria-label="Next page"
                  className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                  onClick={() => viewerRef.current?.next()}
                >
                  <FiArrowRight />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <button
                  aria-label="Zoom out"
                  className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                  onClick={() => viewerRef.current?.zoomOut()}
                >
                  <FiZoomOut />
                </button>

                <span className="text-xs md:text-sm font-medium">
                  {Math.round(viewerState.scale * 100)}%
                </span>

                <button
                  aria-label="Zoom in"
                  className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                  onClick={() => viewerRef.current?.zoomIn()}
                >
                  <FiZoomIn />
                </button>
              </div>
            </div>

            {/* Center: tools */}
            <div className="hidden sm:flex items-center gap-4 md:gap-6 text-gray-300">
              {TOOL_ITEMS.map((item) => (
                <button
                  key={item.id}
                  aria-label={item.title}
                  className={`p-2 rounded-lg transition-all duration-300 transform ${activeStyle(
                    item.id
                  )}`}
                  onClick={() => toggleTool(item.id)}
                >
                  {item.icon}
                  {isActive(item.id) && (
                    <span className="absolute inset-0 rounded-lg blur-md bg-[#FF9A3D]/40 opacity-60 animate-pulseGlow" />
                  )}
                </button>
              ))}
              <button
                aria-label="More"
                className="p-2 hover:bg-[#1c2432] rounded-lg transition"
              >
                <FiMoreHorizontal />
              </button>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-2 md:gap-4 text-gray-300">
              <button
                aria-label="Rotate left"
                className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                onClick={() => viewerRef.current?.rotateLeft()}
              >
                <FiRotateCcw />
              </button>
              <button
                aria-label="Rotate right"
                className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                onClick={() => viewerRef.current?.rotateRight()}
              >
                <FiRotateCw />
              </button>
              <button
                aria-label="Download"
                className="hidden sm:inline-flex p-2 hover:bg-[#1c2432] rounded-lg transition"
              >
                <FiDownload />
              </button>
              <button
                aria-label="Upload"
                className="p-2 hover:bg-[#1c2432] rounded-lg transition"
                onClick={() => fileInputRef.current?.click()}
              >
                <FiUpload />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Main Layout === */}
      <div
        className={`flex flex-1 overflow-hidden transition-all duration-300 ${
          fileUrl ? (showToolbar ? "pt-[120px]" : "pt-[64px]") : "pt-[64px]"
        }`}
      >
        {/* LEFT SIDEBAR — desktop & large screens only */}
        <aside className="hidden lg:flex w-72 bg-[#141a23] border-r border-gray-700 flex-shrink-0 h-full flex-col">
          {/* Thumbnails area */}
          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            <CollapsiblePanel
              title={`Pages (${viewerState.totalPages || 0})`}
              isOpen={isPagesOpen}
              onToggle={(state) => setIsPagesOpen(state)}
            >
              {thumbnails.length > 0 ? (
                <ul className="space-y-3 pb-3">
                  {thumbnails.map((t) => (
                    <li
                      key={t.id}
                      onClick={() => viewerRef.current?.goToPage(t.pageNum)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all shadow-sm hover:shadow-md ${
                        viewerState.currentPage === t.pageNum
                          ? "border-yellow-400 bg-[#2b3442]"
                          : "border-gray-600 bg-[#1f2733] hover:bg-[#2a3442]"
                      }`}
                    >
                      <div className="text-xs text-gray-200 mb-1 font-semibold tracking-wide">
                        Page {t.pageNum}
                      </div>
                      {t.thumb ? (
                        <div className="bg-[#fafafa] border border-gray-300 rounded-md overflow-hidden shadow-sm">
                          <img
                            src={t.thumb}
                            alt={`Page ${t.pageNum}`}
                            className="w-full rounded transition-transform duration-200 hover:scale-[1.02]"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-20 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                          No thumbnail
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic p-2">
                  {fileUrl
                    ? `Generating thumbnails... (${thumbProgress}/${viewerState.totalPages || 0})`
                    : "Upload a PDF to see pages here."}
                </p>
              )}
            </CollapsiblePanel>
          </div>

          {/* Ad block at bottom */}
          <div className="p-4">
            <div className="relative rounded-xl p-4 bg-[#0f141c] border border-[#ff9a3d]/50 shadow-[0_0_15px_rgba(255,154,61,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff9a3d]/10 via-transparent to-transparent animate-shimmerSlow" />
              <p className="text-[#FF9A3D] font-semibold text-center">Sponsored</p>
              <p className="text-gray-300 text-xs text-center mt-1">
                Promote your product here to reach 100K+ creators.
              </p>
            </div>
          </div>
        </aside>

        {/* CENTER — PDF Viewer */}
        <main className="flex-1 bg-[#0f141c] relative overflow-hidden">
          {fileUrl ? (
            <PDFViewer
              ref={viewerRef}
              fileUrl={fileUrl}
              scale={scale}
              onStateChange={setViewerState}
              activeTool={activeTool} 
              onThumbnailsChange={(items, progress) => {
                setThumbnails(items);
                setThumbProgress(progress);
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 italic text-sm">
              Upload a PDF to view and edit documents.
            </div>
          )}

          {/* === Mobile / Tablet Floating Buttons === */}
          {fileUrl && (
            <div className="lg:hidden">
              {/* Left: Pages */}
              <button
                aria-label="Open pages drawer"
                onClick={() => {
                  setShowPagesDrawer(true);
                  setShowPropsDrawer(false);
                }}
                className="fixed bottom-4 left-4 z-40 px-4 py-3 rounded-full bg-[#141a23] border border-[#1f2a38] shadow-lg text-gray-200 flex items-center gap-2"
              >
                <FiFileText /> Pages
              </button>

              {/* Right: Properties */}
              <button
                aria-label="Open properties drawer"
                onClick={() => {
                  setShowPropsDrawer(true);
                  setShowPagesDrawer(false);
                }}
                className="fixed bottom-4 right-4 z-40 px-4 py-3 rounded-full bg-[#141a23] border border-[#1f2a38] shadow-lg text-gray-200 flex items-center gap-2"
              >
                <FiSettings /> Properties
              </button>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR — desktop only */}
        <aside className="hidden lg:flex w-72 bg-[#141a23] border-l border-gray-700 p-4 flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-200">Properties</h3>
            <p className="text-sm text-gray-400 mt-2">
              {fileUrl
                ? activeTool
                  ? `Settings for "${activeTool}" tool`
                  : "Select a tool to edit."
                : "Upload a PDF to access editing tools."}
            </p>
          </div>

          <div className="mt-6">
            <div className="relative rounded-xl p-4 bg-[#0f141c] border border-[#00d4b3]/50 shadow-[0_0_15px_rgba(0,212,179,0.3)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4b3]/10 via-transparent to-transparent animate-shimmerSlow" />
              <p className="text-[#00D4B3] font-semibold text-center">Sponsored</p>
              <p className="text-gray-300 text-xs text-center mt-1">
                Display partner ads or your premium features here.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ======================= */}
      {/*   MOBILE/TABLET DRAWERS  */}
      {/* ======================= */}
      <AnimatePresence>
        {/* Pages Drawer (Left) */}
        {showPagesDrawer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPagesDrawer(false)}
            />
            <motion.aside
              role="dialog"
              aria-label="Pages"
              className="fixed top-[64px] bottom-0 left-0 w-[85%] max-w-[360px] bg-[#141a23] border-r border-gray-700 z-50 flex flex-col"
              variants={drawerVariants}
              initial="hiddenLeft"
              animate="showLeft"
              exit="hiddenLeft"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2a38]">
                <span className="font-semibold">Pages ({viewerState.totalPages || 0})</span>
                <button
                  aria-label="Close"
                  onClick={() => setShowPagesDrawer(false)}
                  className="p-2 hover:bg-[#1c2432] rounded"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 custom-scrollbar scroll-smooth">
                {thumbnails.length > 0 ? (
                  <ul className="space-y-3 pb-3">
                    {thumbnails.map((t) => (
                      <li
                        key={t.id}
                        onClick={() => {
                          viewerRef.current?.goToPage(t.pageNum);
                          setShowPagesDrawer(false);
                        }}
                        className={`p-2 rounded-lg border cursor-pointer transition-all shadow-sm hover:shadow-md ${
                          viewerState.currentPage === t.pageNum
                            ? "border-yellow-400 bg-[#2b3442]"
                            : "border-gray-600 bg-[#1f2733] hover:bg-[#2a3442]"
                        }`}
                      >
                        <div className="text-xs text-gray-200 mb-1 font-semibold tracking-wide">
                          Page {t.pageNum}
                        </div>
                        {t.thumb ? (
                          <img
                            src={t.thumb}
                            alt={`Page ${t.pageNum}`}
                            className="w-full rounded border border-gray-300"
                          />
                        ) : (
                          <div className="w-full h-20 bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400">
                            No thumbnail
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm italic p-2">
                    {fileUrl
                      ? `Generating thumbnails... (${thumbProgress}/${
                          viewerState.totalPages || 0
                        })`
                      : "Upload a PDF to see pages here."}
                  </p>
                )}
              </div>

              {/* Ad inside drawer bottom */}
              <div className="p-4">
                <div className="relative rounded-xl p-4 bg-[#0f141c] border border-[#ff9a3d]/50 shadow-[0_0_15px_rgba(255,154,61,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff9a3d]/10 via-transparent to-transparent animate-shimmerSlow" />
                  <p className="text-[#FF9A3D] font-semibold text-center">Sponsored</p>
                  <p className="text-gray-300 text-xs text-center mt-1">
                    Promote your product here to reach 100K+ creators.
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}

        {/* Properties Drawer (Right) */}
        {showPropsDrawer && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPropsDrawer(false)}
            />
            <motion.aside
              role="dialog"
              aria-label="Properties"
              className="fixed top-[64px] bottom-0 right-0 w-[85%] max-w-[360px] bg-[#141a23] border-l border-gray-700 z-50 flex flex-col"
              variants={drawerVariants}
              initial="hiddenRight"
              animate="showRight"
              exit="hiddenRight"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f2a38]">
                <span className="font-semibold">Properties</span>
                <button
                  aria-label="Close"
                  onClick={() => setShowPropsDrawer(false)}
                  className="p-2 hover:bg-[#1c2432] rounded"
                >
                  <FiX />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <p className="text-sm text-gray-400">
                  {fileUrl
                    ? activeTool
                      ? `Settings for "${activeTool}" tool`
                      : "Select a tool to edit."
                    : "Upload a PDF to access editing tools."}
                </p>
              </div>

              {/* Ad inside drawer bottom */}
              <div className="p-4">
                <div className="relative rounded-xl p-4 bg-[#0f141c] border border-[#00d4b3]/50 shadow-[0_0_15px_rgba(0,212,179,0.3)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#00d4b3]/10 via-transparent to-transparent animate-shimmerSlow" />
                  <p className="text-[#00D4B3] font-semibold text-center">Sponsored</p>
                  <p className="text-gray-300 text-xs text-center mt-1">
                    Display partner ads or your premium features here.
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
