declare module "pdfjs-dist/legacy/build/pdf" {
  export * from "pdfjs-dist/types/src/display/api";
  import * as pdfjs from "pdfjs-dist/types/src/display/api";
  export default pdfjs;
}

declare module "pdfjs-dist/build/pdf.worker.min.js" {
  const worker: string;
  export default worker;
}

declare module "pdfjs-dist" {
  export * from "pdfjs-dist/types/src/pdf"; // re-use bundled types
}
