/// <reference lib="webworker" />
import * as Comlink from 'comlink';
import mupdf from 'mupdf';
import { MUPDF_LOADED } from './mupdf';

/**
 * File is located in the public folder, add the following to your angular.json (assets section)
 *
 * {
 *  "glob": "*.{js,wasm}",
 *  "input": "node_modules/mupdf/dist"
 * }
 */
const mupdfScript = '/mupdf.js';

export class MupdfWorker {
  private mupdf?: typeof mupdf;
  private document?: mupdf.Document;

  constructor() {
    this.initializeMupdf();
  }

  private async initializeMupdf() {
    /**
     * Angular does not support top level awaits, so we use a variable to dynamically import our mupdf.js script.
     * see: https://github.com/angular/angular-cli/issues/26507
     */
    import(/* @vite-ignore */ mupdfScript).then((mupdf) => {
      this.mupdf = mupdf;

      postMessage(MUPDF_LOADED);
    });
  }

  loadDocument(document: ArrayBuffer) {
    this.document = this.mupdf!.Document.openDocument(
      document,
      'application/pdf'
    );

    return true;
  }

  renderPageAsImage(pageIndex: number = 0, scale: number = 1) {
    return this.document
      ?.loadPage(pageIndex)
      .toPixmap([scale, 0, 0, scale, 0, 0], this.mupdf!.ColorSpace.DeviceRGB)
      .asPNG();
  }
}

Comlink.expose(MupdfWorker);
