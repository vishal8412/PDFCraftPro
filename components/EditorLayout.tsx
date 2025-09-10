"use client";

import { useState } from "react";
import { FiType, FiEdit3, FiImage, FiPenTool, FiRotateCw, FiSave, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import dynamic from "next/dynamic";

// Import PDFViewer dynamically (avoid SSR issues)
const PDFViewer = dynamic(() => import("./PDFViewer"), { ssr: false });

export default function EditorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="h-screen flex flex-col bg-[#0A192F] text-white">
      {/* Top Toolbar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-[#112240]">
        {/* Left Tools */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:text-[#00D4B3]" title="Text Tool">
            <FiType size={20} />
          </button>
          <button className="p-2 hover:text-[#00D4B3]" title="Draw Tool">
            <FiPenTool size={20} />
          </button>
          <button className="p-2 hover:text-[#00D4B3]" title="Annotation Tool">
            <FiEdit3 size={20} />
          </button>
          <button className="p-2 hover:text-[#00D4B3]" title="Insert Image">
            <FiImage size={20} />
          </button>
        </div>

        {/* Center Controls */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:text-[#00D4B3]" title="Undo">
            ⎌
          </button>
          <button className="p-2 hover:text-[#00D4B3]" title="Redo">
            ↻
          </button>
          <button className="p-2 hover:text-[#00D4B3]" title="Zoom In">
            <FiZoomIn size={20} />
          </button>
          <button className="p-2 hover:text-[#00D4B3]" title="Zoom Out">
            <FiZoomOut size={20} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:text-[#00D4B3]" title="Rotate Page">
            <FiRotateCw size={20} />
          </button>
          <label className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#FF9A3D] hover:opacity-90 text-sm font-semibold flex items-center space-x-2 cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
            />
            <FaFilePdf /> <span>{file ? "Change PDF" : "Upload PDF"}</span>
          </label>
        </div>
      </header>

      {/* Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Thumbnails placeholder) */}
        {sidebarOpen && (
          <aside className="w-56 bg-[#112240] border-r border-gray-800 p-3 overflow-y-auto hidden md:block">
            <h3 className="text-sm font-semibold mb-3">Pages</h3>
            <p className="text-xs text-gray-400">Thumbnails will appear here</p>
          </aside>
        )}

        {/* Main Canvas */}
        <main className="flex-1 bg-[#0A192F] flex items-center justify-center overflow-auto">
          <div className="w-full max-w-5xl p-6">
            {file ? (
              <PDFViewer file={file} />
            ) : (
              <div className="h-[80vh] bg-[#1B2B44] border border-gray-700 rounded-md flex items-center justify-center text-gray-400">
                Upload a PDF to start editing
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar (Properties placeholder) */}
        <aside className="w-64 bg-[#112240] border-l border-gray-800 p-4 hidden lg:block">
          <h3 className="text-sm font-semibold mb-3">Properties</h3>
          <p className="text-xs text-gray-400">Tool-specific settings will appear here</p>
        </aside>
      </div>
    </div>
  );
}
