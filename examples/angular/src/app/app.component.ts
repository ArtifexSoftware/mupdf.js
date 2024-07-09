import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { filter, skipWhile, switchMap } from 'rxjs';
import { MupdfService } from './mupdf.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpClient = inject(HttpClient);
  private readonly mupdfService = inject(MupdfService);

  url = signal<string | undefined>(undefined);

  ngOnDestroy(): void {
    const url = this.url();

    if (!!url) {
      URL.revokeObjectURL(url);
    }
  }

  ngOnInit(): void {
    this.mupdfService.workerInitialized$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        skipWhile((workerInitialized) => !workerInitialized)
      )
      .subscribe(() => {
        this.httpClient
          .get('/test.pdf', { responseType: 'arraybuffer' })
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap((arrayBuffer) =>
              this.mupdfService.loadDocument(arrayBuffer)
            ),
            switchMap(() => this.mupdfService.renderPageAsImage(0)),
            filter((uint8Array): uint8Array is Uint8Array => uint8Array != null)
          )
          .subscribe((unit8Array) => {
            this.url.set(
              URL.createObjectURL(new Blob([unit8Array], { type: 'image/png' }))
            );
          });
      });
  }
}
