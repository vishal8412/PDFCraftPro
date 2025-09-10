"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";

interface DrawCanvasProps {
  page: number;
  drawings: { page: number; path: string; x: number; y: number }[];
  setDrawings: Dispatch<SetStateAction<any[]>>;
}

export default function DrawCanvas({ page, drawings, setDrawings }: DrawCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [path, setPath] = useState("");

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.height - (e.clientY - rect.top);
    setPath(`M${x} ${y}`);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.height - (e.clientY - rect.top);
    setPath((prev) => `${prev} L${x} ${y}`);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (path) {
      setDrawings((prev) => [...prev, { page, path, x: 0, y: 0 }]);
      setPath("");
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
