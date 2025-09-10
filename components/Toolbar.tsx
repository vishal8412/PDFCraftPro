"use client";

import {
  PenTool,
  Type,
  Highlighter,
  StickyNote,
  FileUp,
  Download,
} from "lucide-react";

interface ToolbarProps {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
  onUpload: (file: File) => void;
  onExport: () => void;
}

export default function Toolbar({
  activeTool,
  setActiveTool,
  onUpload,
  onExport,
}: ToolbarProps) {
  const tools = [
    { id: "draw", icon: PenTool, label: "Draw" },
    { id: "text", icon: Type, label: "Text" },
    { id: "highlight", icon: Highlighter, label: "Highlight" },
    { id: "note", icon: StickyNote, label: "Sticky Note" },
  ];

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-4 py-2 border-b">
      {/* Left - Tools */}
      <div className="flex items-center gap-2">
        {tools.map(({ id, icon: Icon, label }) => (
          <div key={id} className="relative group">
            <button
              onClick={() => setActiveTool(activeTool === id ? null : id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition ${
                activeTool === id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
            {/* Tooltip */}
            <span className="absolute bottom-full mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded shadow">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Right - Upload & Export */}
      <div className="flex items-center gap-2">
        <label className="relative group flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">
          <FileUp className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
          {/* Tooltip */}
          <span className="absolute bottom-full mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded shadow">
            Upload PDF
          </span>
        </label>
        <button
          onClick={onExport}
          className="relative group flex items-center gap-1 px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
          {/* Tooltip */}
          <span className="absolute bottom-full mb-1 hidden group-hover:block px-2 py-1 text-xs text-white bg-black rounded shadow">
            Export PDF
          </span>
        </button>
      </div>
    </div>
  );
}
