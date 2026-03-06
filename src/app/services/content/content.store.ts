import { Injectable, inject, signal } from '@angular/core';
import { ContentService } from './content.service';
@Injectable({ providedIn: 'root' })
export class ContentStore {
  private content = inject(ContentService);
  private pages = signal<Record<string, any>>({});

  loadPage(slug: string) {
    if (this.pages()[slug]) return;

    this.content.getPage(slug).subscribe((page) => {
      this.pages.update((p) => ({
        ...p,
        [slug]: page,
      }));
    });
  }

  page(slug: string) {
    return this.pages()[slug];
  }
}
