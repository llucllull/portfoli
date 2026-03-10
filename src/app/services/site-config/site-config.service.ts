import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  private router = inject(Router);
  private language = signal<string | null>(null);
  private languages = signal<any[]>([]);
  private defaultLanguage = signal('es');
  private config = signal<any>(null);

  getCurrentLang(): string {
    const segments = this.router.url.split('/').filter(Boolean);
    return segments[0] || this.defaultLanguage();
  }

  getLanguage() {
    return this.language() ?? this.getCurrentLang();
  }

  setLanguage(lang: string) {
    this.language.set(lang);
  }

  setLanguages(langs: any[]) {
    this.languages.set(langs);
  }

  getLanguages() {
    return this.languages();
  }

  setDefaultLanguage(lang: string) {
    this.defaultLanguage.set(lang);

    // si aún no hay language, usar el default
    if (!this.language()) {
      this.language.set(lang);
    }
  }

  getDefaultLanguage() {
    return this.defaultLanguage();
  }

  setConfig(config: any) {
    this.config.set(config);
  }

  getConfig() {
    return this.config();
  }
}
