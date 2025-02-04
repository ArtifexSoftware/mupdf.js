/// <reference lib="webworker" />
import * as Comlink from "comlink";
import * as mupdfjs from "mupdf/mupdfjs";
import { PDFDocument,PDFPage } from "mupdf/mupdfjs";

export const MUPDF_LOADED = "MUPDF_LOADED";

export class MupdfWorker {
  private document?: PDFDocument;
  private page?: PDFPage;

  constructor() {
    this.initializeMupdf();
  }

  private initializeMupdf() {
    try {
      postMessage(MUPDF_LOADED);
    } catch (error) {
      console.error("Failed to initialize MuPDF:", error);
    }
  }

  // ===> Here you can create methods <===
  // ===> that call statics and methods <===
  // ===> from mupdfjs which wraps ./node_modules/mupdf/dist/mupdf.js <===

  loadDocument(document: ArrayBuffer): boolean {
    this.document = mupdfjs.PDFDocument.openDocument(
      document,
      "application/pdf"
    );

    return true;
  }

  renderPageAsImage(pageIndex:number = 0, scale:number = 1): Uint8Array {
    if (!this.document) throw new Error("Document not loaded");

    const pixmap = new mupdfjs.PDFPage(this.document, pageIndex).toPixmap(
      [scale, 0, 0, scale, 0, 0],
      mupdfjs.ColorSpace.DeviceRGB
    );

    let png = pixmap.asPNG();
    pixmap.destroy();
    return png;
  }

  getPageCount(): number {
    if (!this.document) throw new Error("Document not loaded");

    return this.document.countPages();
  }
}

Comlink.expose(new MupdfWorker());
