import { Injectable, inject, signal } from '@angular/core';
import { of, tap } from 'rxjs';
import { ContentService } from './content.service';

@Injectable({ providedIn: 'root' })
export class ContentStore {
  private content = inject(ContentService);
  private pages = signal<Record<string, any>>({});

  loadPage(slug: string) {
    if (this.pages()[slug]) {
      return of(this.pages()[slug]);
    }

    return this.content.getPage(slug).pipe(
      tap((page) => {
        this.pages.update((p) => ({
          ...p,
          [slug]: page,
        }));
      }),
    );
  }

  page(slug: string) {
    return this.pages()[slug];
  }

  prefetchPages(slugs: string[]) {
    for (const slug of slugs) {
      if (this.pages()[slug]) continue;

      this.content.getPage(slug).subscribe((page) => {
        this.pages.update((p) => ({
          ...p,
          [slug]: page,
        }));
      });
    }
  }
}
