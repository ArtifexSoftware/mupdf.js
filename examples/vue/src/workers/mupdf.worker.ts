/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import * as mupdf from 'mupdf';

export const MUPDF_LOADED = 'MUPDF_LOADED';

export class MupdfWorker {
  private document?: mupdf.Document;

  constructor() {
    this.initializeMupdf();
  }

  private async initializeMupdf() {
    try {
      postMessage(MUPDF_LOADED);
    } catch (error) {
      console.error('Failed to initialize MuPDF:', error);
    }
  }

  // ===> Here you can create methods <===
  // ===> that call statics and methods <===
  // ===> from mupdf (./node_modules/mupdf/dist/mupdf.js) <===

  loadDocument(document: ArrayBuffer): boolean {
    this.document = mupdf.Document.openDocument(document, 'application/pdf');
    return true;
  }

  renderPageAsImage(pageIndex: number = 0, scale: number = 1): Uint8Array {
    if (!this.document) throw new Error('Document not loaded');
    const page = this.document.loadPage(pageIndex);
    const pixmap = page.toPixmap([scale, 0, 0, scale, 0, 0], mupdf.ColorSpace.DeviceRGB);
    return pixmap.asPNG();
  }
}

Comlink.expose(new MupdfWorker());
