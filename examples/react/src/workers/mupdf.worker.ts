/// <reference lib="webworker" />
import * as Comlink from "comlink";
import * as mupdfjs from "mupdf/mupdfjs";
import { PDFDocument } from "mupdf/mupdfjs";

export const MUPDF_LOADED = "MUPDF_LOADED";

export class MupdfWorker {
  private document?: PDFDocument;

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

  renderPageAsImage(pageIndex = 0, scale = 1): Uint8Array {
    if (!this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex);
    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      mupdfjs.ColorSpace.DeviceRGB
    );

    return pixmap.asPNG();
  }
}

Comlink.expose(new MupdfWorker());
