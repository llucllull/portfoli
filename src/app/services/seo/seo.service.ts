import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private isBrowser: boolean;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  setSeoData(seo: any, defaultTitle?: string, defaultDescription?: string) {
    if (!seo) return;

    // Set title
    const title = this.getLocalizedValue(seo.title) || defaultTitle || '';
    if (title && this.isBrowser) {
      this.title.setTitle(title);
    }

    // Set description
    const description =
      this.getLocalizedValue(seo.description) || defaultDescription || '';
    if (description) {
      this.updateMetaTag('description', description);
    }

    // Set OG title
    if (title) {
      this.updateMetaTag('og:title', title);
    }

    // Set OG description
    if (description) {
      this.updateMetaTag('og:description', description);
    }
  }

  private getLocalizedValue(value: any): string {
    if (!value) return '';

    if (typeof value === 'string') return value;

    // Try to get language from localStorage or use default
    const lang = this.isBrowser
      ? localStorage.getItem('language') || 'es'
      : 'es';

    return value[lang] || value['es'] || Object.values(value)[0] || '';
  }

  private updateMetaTag(name: string, content: string) {
    if (this.isBrowser) {
      this.meta.updateTag({ name, content });
    }
  }
}
