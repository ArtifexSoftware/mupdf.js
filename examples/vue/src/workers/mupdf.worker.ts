/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import type { MupdfWorker } from '../types/mupdf';

export const MUPDF_LOADED = 'MUPDF_LOADED';

const mupdfScript = import.meta.env.PROD ? '/assets/mupdf.js' : '/mupdf.js';

class MupdfWorkerImpl implements MupdfWorker {
  private mupdf?: any;
  private document?: any;

  constructor() {
    this.initializeMupdf();
  }

  private async initializeMupdf() {
    try {
      const mupdfModule = await import(/* @vite-ignore */ mupdfScript);
      this.mupdf = mupdfModule;
      postMessage(MUPDF_LOADED);
    } catch (error) {
      console.error('Failed to initialize MuPDF:', error);
    }
  }

  async loadDocument(document: ArrayBuffer): Promise<boolean> {
    if (!this.mupdf) throw new Error('MuPDF not initialized');
    this.document = this.mupdf.Document.openDocument(
      document,
      'application/pdf'
    );
    return true;
  }

  async renderPageAsImage(pageIndex: number = 0, scale: number = 1): Promise<Uint8Array> {
    if (!this.mupdf || !this.document) throw new Error('Document not loaded');
    const page = this.document.loadPage(pageIndex);
    const pixmap = page.toPixmap([scale, 0, 0, scale, 0, 0], this.mupdf.ColorSpace.DeviceRGB);
    return pixmap.asPNG();
  }
}

Comlink.expose(new MupdfWorkerImpl());