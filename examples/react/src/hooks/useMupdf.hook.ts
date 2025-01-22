import { MUPDF_LOADED, type MupdfWorker } from "@/workers/mupdf.worker";
import * as Comlink from "comlink";
import { Remote } from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMupdf() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isWorkerInitialized, setIsWorkerInitialized] = useState(false);
  const document = useRef<ArrayBuffer | null>(null);
  const mupdfWorker = useRef<Remote<MupdfWorker>>();

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/mupdf.worker", import.meta.url),
      {
        type: "module",
      }
    );
    mupdfWorker.current = Comlink.wrap<MupdfWorker>(worker);

    worker.addEventListener("message", (event) => {
      if (event.data === MUPDF_LOADED) {
        setIsWorkerInitialized(true);
      }
    });

    return () => {
      worker.terminate();
    };
  }, []);

  const loadDocument = useCallback((arrayBuffer: ArrayBuffer) => {
    document.current = arrayBuffer;
    return mupdfWorker.current!.loadDocument(arrayBuffer);
  }, []);

  // ===> Here you can create hooks <===
  // ===> that use the methods of the worker. <===
  // ===> You can use useCallback to avoid unnecessary rerenders <===

  const renderPage = useCallback((pageIndex: number) => {
    if (!document.current) {
      throw new Error("Document not loaded");
    }

    setCurrentPage(pageIndex);

    return mupdfWorker.current!.renderPageAsImage(
      pageIndex,
      (window.devicePixelRatio * 96) / 72
    );
  }, []);

  return {
    isWorkerInitialized,
    loadDocument,
    renderPage,
    currentPage,
  };
}
