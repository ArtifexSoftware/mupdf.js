import { MUPDF_LOADED, type MupdfWorker } from '@/workers/mupdf.worker';
import * as Comlink from 'comlink';
import { ref, shallowRef } from 'vue';

const worker = new Worker(new URL('../workers/mupdf.worker', import.meta.url), { type: 'module' });
const mupdfWorker = Comlink.wrap<MupdfWorker>(worker);
const workerInitialized = ref(false);

worker.addEventListener('message', (event) => {
  if (event.data === MUPDF_LOADED) {
    workerInitialized.value = true;
  }
});

export function useMupdf() {
  const document = shallowRef<ArrayBuffer | null>(null);
  const currentPage = ref(0);

  // ===> Here you can create functions <===
  // ===> that use the methods of the worker. <===

  const loadDocument = (arrayBuffer: ArrayBuffer) => {
    document.value = arrayBuffer;
    return mupdfWorker.loadDocument(arrayBuffer);
  };

  const renderPage = (pageIndex: number) => {
    if (!document.value) throw new Error('Document not loaded');
    currentPage.value = pageIndex;
    return mupdfWorker.renderPageAsImage(pageIndex, (window.devicePixelRatio * 96) / 72);
  };

  return {
    workerInitialized,
    loadDocument,
    renderPage,
    currentPage
  };
}
