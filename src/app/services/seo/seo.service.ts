import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
  ) {}

  setSeoData(
    seo: any,
    defaultTitle?: string,
    defaultDescription?: string,
    lang: string = 'es',
  ): void {
    if (!seo) return;

    // Title
    const title = this.getLocalizedValue(seo.title, lang) || defaultTitle || '';

    if (title) {
      this.title.setTitle(title);
    }

    // Description
    const description =
      this.getLocalizedValue(seo.description, lang) || defaultDescription || '';

    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }

    // Open Graph
    if (title) {
      this.meta.updateTag({ property: 'og:title', content: title });
    }

    if (description) {
      this.meta.updateTag({ property: 'og:description', content: description });
    }

    this.meta.updateTag({ property: 'og:locale', content: lang });
  }

  private getLocalizedValue(value: any, lang: string): string {
    if (!value) return '';

    if (typeof value === 'string') return value;

    return value[lang] || value['es'] || Object.values(value)[0] || '';
  }
}
