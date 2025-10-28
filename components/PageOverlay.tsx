"use client";

import { useEffect, useState } from "react";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";

// ✅ Define corner union type
type OverlayCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface PageOverlayProps {
  currentPage: number | null;
  totalPages: number | undefined;
}

export default function PageOverlay({ currentPage, totalPages }: PageOverlayProps) {
  const defaultOverlayPos = {
    corner: "bottom-right" as OverlayCorner,
    offsetX: 20,
    offsetY: 60,
  };

  const [showPageOverlay, setShowPageOverlay] = useState(false);
  const [overlayLocked, setOverlayLocked] = useState(false);
  const [overlayPos, setOverlayPos] = useState(defaultOverlayPos);
  const [snapCorner, setSnapCorner] = useState<OverlayCorner | null>(null);

  // Load saved state
  useEffect(() => {
    const savedPos = localStorage.getItem("pdfcraft-overlay-pos");
    const savedLock = localStorage.getItem("pdfcraft-overlay-lock");
    if (savedPos) setOverlayPos(JSON.parse(savedPos));
    if (savedLock) setOverlayLocked(JSON.parse(savedLock));
  }, []);

  // Save state
  useEffect(() => {
    localStorage.setItem("pdfcraft-overlay-pos", JSON.stringify(overlayPos));
  }, [overlayPos]);

  useEffect(() => {
    localStorage.setItem("pdfcraft-overlay-lock", JSON.stringify(overlayLocked));
  }, [overlayLocked]);

  // Show overlay when page changes
  useEffect(() => {
    if (!currentPage || !totalPages) return;
    setShowPageOverlay(true);
    const timeout = setTimeout(() => setShowPageOverlay(false), 1200);
    return () => clearTimeout(timeout);
  }, [currentPage, totalPages]);

  // Snap logic
  const snapOverlayPosition = (x: number, y: number) => {
    const middleX = window.innerWidth / 2;
    const middleY = window.innerHeight / 2;

    const corner: OverlayCorner =
      y < middleY
        ? x < middleX
          ? "top-left"
          : "top-right"
        : x < middleX
        ? "bottom-left"
        : "bottom-right";

    setOverlayPos({ corner, offsetX: 20, offsetY: 60 });
    setSnapCorner(corner);
    setTimeout(() => setSnapCorner(null), 800);
  };

  const resetOverlay = () => {
    setOverlayPos(defaultOverlayPos);
    setSnapCorner("bottom-right");
    setTimeout(() => setSnapCorner(null), 800);
  };

  return (
    <>
      {/* Overlay */}
      {showPageOverlay && currentPage && (
        <div
          className="absolute bg-black/70 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold select-none flex items-center gap-2 transition-all duration-300 ease-in-out cursor-default"
          style={{
            ...(overlayPos.corner.includes("top")
              ? { top: overlayPos.offsetY }
              : { bottom: overlayPos.offsetY }),
            ...(overlayPos.corner.includes("left")
              ? { left: overlayPos.offsetX }
              : { right: overlayPos.offsetX }),
          }}
          onMouseDown={(e) => {
            if (overlayLocked) return;
            e.preventDefault();
            const handleUp = (upEvent: MouseEvent) => {
              snapOverlayPosition(upEvent.clientX, upEvent.clientY);
              window.removeEventListener("mouseup", handleUp);
            };
            window.addEventListener("mouseup", handleUp);
          }}
          onDoubleClick={resetOverlay}
        >
          <span>
            Page {currentPage} of {totalPages}
          </span>
          {!overlayLocked && (
            <ArrowsPointingOutIcon className="w-4 h-4 text-yellow-400 cursor-move" />
          )}
        </div>
      )}

      {/* Snap Glow Indicators */}
      <div className="pointer-events-none absolute inset-0">
        {(["top-left", "top-right", "bottom-left", "bottom-right"] as OverlayCorner[]).map(
          (corner) => (
            <div
              key={corner}
              className={`absolute w-4 h-4 rounded-full bg-yellow-400 transition-opacity duration-500 ${
                snapCorner === corner ? "opacity-70" : "opacity-0"
              }`}
              style={{
                top: corner.includes("top") ? "0.5rem" : undefined,
                bottom: corner.includes("bottom") ? "0.5rem" : undefined,
                left: corner.includes("left") ? "0.5rem" : undefined,
                right: corner.includes("right") ? "0.5rem" : undefined,
              }}
            />
          )
        )}
      </div>
    </>
  );
}
