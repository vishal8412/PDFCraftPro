"use client";
import { useEffect, useRef } from "react";

export function InlineText({
  x,
  y,
  page,
  onSave,
}: {
  x: number;
  y: number;
  page: number;
  onSave: (text: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className="absolute bg-transparent border border-dashed border-gray-400 text-black text-sm px-1 min-w-[40px] outline-none"
      style={{ top: y, left: x }}
      onBlur={(e) => {
        const text = e.currentTarget.innerText.trim();
        if (text) onSave(text);
        e.currentTarget.remove();
      }}
    />
  );
}
