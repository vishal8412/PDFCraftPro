declare module "pdfjs-dist/build/pdf" {
  import type { PDFDocumentProxy } from "pdfjs-dist";

  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(src: any): {
    promise: Promise<PDFDocumentProxy>;
  };
}

declare module "pdfjs-dist/build/pdf.worker?url" {
  const workerSrc: string;
  export default workerSrc;
}

declare module "pdfjs-dist" {
  export interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  export interface PDFPageProxy {
    getViewport(params: { scale: number }): {
      width: number;
      height: number;
    };
    render(renderContext: any): any;
  }
}
