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

  resolveLang(obj: any, lang: string): any {
    if (obj == null) return obj;

    if (Array.isArray(obj)) {
      return obj.map((v) => this.resolveLang(v, lang));
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    const keys = Object.keys(obj);

    const isLangObject =
      keys.length > 0 && keys.every((k) => ['es', 'en', 'ca'].includes(k));

    if (isLangObject) {
      return obj[lang] ?? obj['es'] ?? obj[keys[0]] ?? '';
    }

    const result: any = {};

    for (const key of keys) {
      result[key] = this.resolveLang(obj[key], lang);
    }

    return result;
  }
}
