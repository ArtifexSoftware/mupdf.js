export interface MupdfWorker {
    loadDocument(document: ArrayBuffer): Promise<boolean>;
    renderPageAsImage(pageIndex?: number, scale?: number): Promise<Uint8Array>;
  }