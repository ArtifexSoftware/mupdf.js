/// <reference lib="webworker" />
import * as Comlink from "comlink";
import { ColorSpace, Document } from "mupdf";

export const MUPDF_LOADED = "MUPDF_LOADED";

const mupdfScript = import.meta.env.PROD
  ? "/assets/mupdf.js"
  : "/node_modules/mupdf/dist/mupdf.js";

export class MupdfWorker {
  private mupdf?: {
    Document: typeof Document;
    ColorSpace: typeof ColorSpace;
  };
  private document?: Document;

  constructor() {
    this.initializeMupdf();
  }

  private async initializeMupdf() {
    try {
      const mupdfModule = await import(mupdfScript);
      this.mupdf = mupdfModule;
      postMessage(MUPDF_LOADED);
    } catch (error) {
      console.error("Failed to initialize MuPDF:", error);
    }
  }

  // ===> Here you can create methods <===
  // ===> that call statics and methods <===
  // ===> from .\node_modules\mupdf\dist\mupdf.js <===

  async loadDocument(document: ArrayBuffer): Promise<boolean> {
    if (!this.mupdf) throw new Error("MuPDF not initialized");

    this.document = this.mupdf.Document.openDocument(
      document,
      "application/pdf"
    );

    return true;
  }

  async renderPageAsImage(
    pageIndex: number = 0,
    scale: number = 1
  ): Promise<Uint8Array> {
    if (!this.mupdf || !this.document) throw new Error("Document not loaded");

    const page = this.document.loadPage(pageIndex);
    const pixmap = page.toPixmap(
      [scale, 0, 0, scale, 0, 0],
      this.mupdf.ColorSpace.DeviceRGB
    );

    return pixmap.asPNG();
  }
}

Comlink.expose(new MupdfWorker());
