// lib/pdfjs.ts
import * as pdfjsLib from "pdfjs-dist";

// 👇 Tell PDF.js where the worker is
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export default pdfjsLib;
