import { Injectable } from '@angular/core';
import * as Comlink from 'comlink';
import { BehaviorSubject, defer } from 'rxjs';
import { MUPDF_LOADED } from './mupdf';
import { MupdfWorker } from './mupdf.worker';

@Injectable({
  providedIn: 'root',
})
export class MupdfService {
  private worker!: Comlink.Remote<MupdfWorker>;

  private readonly workerInitializedSubject = new BehaviorSubject(false);

  readonly workerInitialized$ = this.workerInitializedSubject.asObservable();

  constructor() {
    this.initializeWorker();
  }

  private async initializeWorker() {
    this.worker = await new Promise<Comlink.Remote<MupdfWorker>>(
      async (resolve) => {
        const worker = new Worker(new URL('./mupdf.worker', import.meta.url), {
          type: 'module',
        });

        const RemoteMupdfWorker = Comlink.wrap<typeof MupdfWorker>(worker);
        const instance = await new RemoteMupdfWorker();

        const onWorkerMessage = (message: MessageEvent) => {
          if (message.data === MUPDF_LOADED) {
            resolve(instance);

            this.workerInitializedSubject.next(true);

            worker.removeEventListener('message', onWorkerMessage);
          }
        };

        worker.addEventListener('message', onWorkerMessage);
      }
    );
  }

  loadDocument(document: ArrayBuffer) {
    return defer(() => this.worker.loadDocument(document));
  }

  renderPageAsImage(pageIndex: number) {
    return defer(() =>
      this.worker.renderPageAsImage(
        pageIndex,
        (window.devicePixelRatio * 96) / 72
      )
    );
  }
}
