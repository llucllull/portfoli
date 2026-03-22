import { Injectable, signal } from '@angular/core';
import { ContentService } from './content.service';
@Injectable({ providedIn: 'root' })
export class ContentStore {
  private pages = signal<Record<string, any>>({});

  constructor(private content: ContentService) {}

  loadPage(slug: string): Promise<void> {
    return new Promise((resolve) => {
      if (this.pages()[slug]) {
        resolve();
        return;
      }

      this.content.getPage(slug).subscribe({
        next: (page) => {
          this.pages.update((p) => ({
            ...p,
            [slug]: page,
          }));
          resolve();
        },
        error: () => {
          if (slug !== '404') {
            this.loadPage('404').then(resolve);
          } else {
            resolve();
          }
        },
      });
    });
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
