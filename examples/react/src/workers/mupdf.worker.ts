/// <reference lib="webworker" />
import * as Comlink from "comlink";
import { ColorSpace, PDFDocument } from "mupdf/mupdfjs";

export const MUPDF_LOADED = "MUPDF_LOADED";

const mupdfScript = import.meta.env.PROD
  ? "/assets/mupdfjs.js"
  : "/node_modules/mupdf/dist/mupdfjs.js";

export class MupdfWorker {
  private mupdfjs?: {
    PDFDocument: typeof PDFDocument;
    ColorSpace: typeof ColorSpace;
  };
  private document?: PDFDocument;

  constructor() {
    this.initializeMupdf().catch(console.error);
  }

  private async initializeMupdf() {
    try {
      const mupdfjsModule = (await import(
        /* @vite-ignore */ mupdfScript
      )) as MupdfWorker["mupdfjs"];
      this.mupdfjs = mupdfjsModule;
      postMessage(MUPDF_LOADED);
    } catch (error) {
      console.error("Failed to initialize MuPDF:", error);
    }
  }

  // ===> Here you can create methods <===
  // ===> that call statics and methods <===
  // ===> from .\node_modules\mupdf\dist\mupdf.js <===

  loadDocument(document: ArrayBuffer): boolean {
    if (!this.mupdfjs) throw new Error("MuPDF not initialized");

    this.document = this.mupdfjs.PDFDocument.openDocument(
      document,
      "application/pdf"
    );

    return true;
  }

  renderPageAsImage(pageIndex = 0, scale = 1): Uint8Array {
    if (!this.mupdfjs || !this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex);
    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      this.mupdfjs.ColorSpace.DeviceRGB
    );

    return pixmap.asPNG();
  }
}

Comlink.expose(new MupdfWorker());
