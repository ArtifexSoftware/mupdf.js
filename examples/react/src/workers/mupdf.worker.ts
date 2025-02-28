/// <reference lib="webworker" />
import * as Comlink from "comlink";
import * as mupdfjs from "mupdf/mupdfjs"
import { PDFDocument } from "mupdf/mupdfjs";

export const MUPDF_LOADED = "MUPDF_LOADED";

export class MupdfWorker {
  private pdfdocument?: PDFDocument;

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

    this.pdfdocument = mupdfjs.PDFDocument.openDocument(
      document,
      "application/pdf"
    ) as PDFDocument;

    return true;
  }

  renderPageAsImage(pageIndex:number = 0, scale:number = 1): Uint8Array {
    if (!this.pdfdocument) throw new Error("Document not loaded");

    const page = new mupdfjs.PDFPage(this.pdfdocument, pageIndex);

    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      mupdfjs.ColorSpace.DeviceRGB
    );

    let png = pixmap.asPNG();
    pixmap.destroy();
    return png;
  }

  getPageCount(): number {
    if (!this.pdfdocument) throw new Error("Document not loaded");

    return this.pdfdocument.countPages();
  }
}

Comlink.expose(new MupdfWorker());
