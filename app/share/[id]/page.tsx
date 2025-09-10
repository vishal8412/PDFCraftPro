"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { loadPDF } from "@/lib/db";

export default function SharePage() {
  const { id } = useParams();
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!id) return;
    loadPDF(id as string).then((file) => {
      if (file) {
        const blobUrl = URL.createObjectURL(file);
        setUrl(blobUrl);
        setBlob(file);
      }
    });
  }, [id]);

  const handleDownload = () => {
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `shared-${id}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!url) return <p className="p-4">Loading PDF...</p>;

  return (
    <div className="flex flex-col h-screen">
      <div className="p-2 bg-gray-100 border-b flex justify-between items-center">
        <span className="font-medium">Shared PDF</span>
        <button
          onClick={handleDownload}
          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded"
        >
          ⬇ Download
        </button>
      </div>
      <iframe src={url} className="flex-1 border-0" title="Shared PDF" />
    </div>
  );
}
