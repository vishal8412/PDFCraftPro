declare module "pdfjs-dist/legacy/build/pdf.js" {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };

  export function getDocument(src: any): any;

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

declare module "pdfjs-dist/legacy/build/pdf.worker.js?url" {
  const workerSrc: string;
  export default workerSrc;
}
