"use client";

import { Dispatch, SetStateAction } from "react";

interface StickyNotesProps {
  page: number;
  notes: { page: number; x: number; y: number; text: string }[];
  setNotes: Dispatch<SetStateAction<any[]>>;
}

export default function StickyNotes({ page, notes, setNotes }: StickyNotesProps) {
  const handleAddNote = (x: number, y: number) => {
    const text = prompt("Enter note text:");
    if (text) {
      setNotes((prev) => [...prev, { page, x, y, text }]);
    }
  };

  return (
    <div
      className="absolute inset-0"
      onClick={(e) => {
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = rect.bottom - e.clientY;
        handleAddNote(x, y);
      }}
    >
      {notes
        .filter((n) => n.page === page)
        .map((n, i) => (
          <div
            key={i}
            className="absolute bg-yellow-200 text-xs p-1 rounded shadow"
            style={{ left: n.x, top: n.y }}
          >
            {n.text}
          </div>
        ))}
    </div>
  );
}
