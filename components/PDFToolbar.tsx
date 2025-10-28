"use client";

import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Type,
  Highlighter,
  Pencil,
  Eraser,
  MessageSquare,
  Undo2,
  Redo2,
  Download,
  Maximize,
  MoreHorizontal,
} from "lucide-react";
import { Menu } from "@headlessui/react";
import { useState } from "react";

export default function PDFToolbar({
  fileLoaded,
  currentPage,
  totalPages,
  scale,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onRotate,
  onDownload,
  onFitWidth,
  onToolSelect,
  onUndo,
  onRedo,
}: any) {
  const [activeTool, setActiveTool] = useState<string>("");

  const handleToolClick = (tool: string) => {
    setActiveTool((prev) => (prev === tool ? "" : tool));
    onToolSelect?.(tool);
  };

  const btn =
    "p-2 rounded hover:bg-[#1a2230] border border-transparent hover:border-gray-700 transition";
  const icon = "text-gray-300";

  return (
    <div className="sticky top-[72px] z-40 w-full h-14 bg-[#121a25] border-b border-gray-800 flex items-center justify-between px-3 select-none shadow-[0_2px_6px_rgba(0,0,0,0.25)]">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <button onClick={onZoomOut} className={btn} title="Zoom Out">
          <ZoomOut className="text-blue-400" size={18} />
        </button>
        <span className="hidden sm:inline text-gray-400 text-sm w-12 text-center">
          {(scale * 100).toFixed(0)}%
        </span>
        <button onClick={onZoomIn} className={btn} title="Zoom In">
          <ZoomIn className="text-blue-400" size={18} />
        </button>
      </div>

      {/* Middle Section */}
      {fileLoaded && (
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className={btn}>
            <ChevronLeft className="text-gray-300" size={20} />
          </button>
          <span className="text-gray-300 text-sm">
            Page {currentPage || 1} / {totalPages || 0}
          </span>
          <button onClick={onNext} className={btn}>
            <ChevronRight className="text-gray-300" size={20} />
          </button>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {fileLoaded && (
          <>
            {/* Highlight */}
            <button
              onClick={() => handleToolClick("highlight")}
              className={`${btn} ${
                activeTool === "highlight"
                  ? "bg-[#1e2738] border-yellow-400"
                  : ""
              }`}
              title="Highlight"
            >
              <Highlighter className="text-yellow-400" size={18} />
            </button>

            {/* Draw */}
            <button
              onClick={() => handleToolClick("draw")}
              className={`${btn} ${
                activeTool === "draw"
                  ? "bg-[#1e2738] border-blue-400"
                  : ""
              }`}
              title="Draw"
            >
              <Pencil className="text-blue-400" size={18} />
            </button>

            {/* Text */}
            <button
              onClick={() => handleToolClick("text")}
              className={`${btn} ${
                activeTool === "text"
                  ? "bg-[#1e2738] border-green-400"
                  : ""
              }`}
              title="Add Text"
            >
              <Type className="text-green-400" size={18} />
            </button>

            {/* More Menu */}
            <Menu as="div" className="relative">
              <Menu.Button className={`${btn} border border-gray-700`}>
                <MoreHorizontal className={icon} size={18} />
              </Menu.Button>

              <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right bg-[#141a23] border border-gray-700 rounded-md shadow-lg z-50">
                <div className="p-2 flex flex-col gap-1">
                  <button
                    onClick={() => handleToolClick("erase")}
                    className="flex items-center gap-2 text-gray-300 hover:bg-[#1a2230] rounded px-2 py-1 text-sm"
                  >
                    <Eraser size={16} className="text-red-400" /> Erase
                  </button>
                  <button
                    onClick={() => handleToolClick("comment")}
                    className="flex items-center gap-2 text-gray-300 hover:bg-[#1a2230] rounded px-2 py-1 text-sm"
                  >
                    <MessageSquare size={16} className="text-purple-400" /> Comment
                  </button>
                  <button
                    onClick={() => onRotate("left")}
                    className="flex items-center gap-2 text-gray-300 hover:bg-[#1a2230] rounded px-2 py-1 text-sm"
                  >
                    <RotateCcw size={16} /> Rotate Left
                  </button>
                  <button
                    onClick={() => onRotate("right")}
                    className="flex items-center gap-2 text-gray-300 hover:bg-[#1a2230] rounded px-2 py-1 text-sm"
                  >
                    <RotateCw size={16} /> Rotate Right
                  </button>
                  <button
                    onClick={onFitWidth}
                    className="flex items-center gap-2 text-gray-300 hover:bg-[#1a2230] rounded px-2 py-1 text-sm"
                  >
                    <Maximize size={16} /> Fit Width
                  </button>
                </div>
              </Menu.Items>
            </Menu>

            {/* Undo / Redo / Download */}
            <button onClick={onUndo} className={btn}>
              <Undo2 className="text-gray-400 hover:text-white transition" size={18} />
            </button>
            <button onClick={onRedo} className={btn}>
              <Redo2 className="text-gray-400 hover:text-white transition" size={18} />
            </button>
            <button onClick={onDownload} className={btn}>
              <Download className="text-gray-400 hover:text-white transition" size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
