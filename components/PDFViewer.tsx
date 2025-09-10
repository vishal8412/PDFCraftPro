"use client";
import { useEffect, useRef, useState } from "react";
import pdfjsLib from "../lib/pdfjs";

export default function PDFViewer({ file }: { file: File }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPDF = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        if (containerRef.current) containerRef.current.innerHTML = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
            canvas, // required in v5
          }).promise;

          containerRef.current?.appendChild(canvas);
        }
      } catch (err: any) {
        console.error("PDF render error:", err);
        setError(err.message || "Failed to render PDF");
      }
    };

    renderPDF();
  }, [file]);

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div ref={containerRef}></div>
    </div>
  );
}
