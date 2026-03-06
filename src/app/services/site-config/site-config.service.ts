import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  private language = signal('es');
  private languages = signal<any[]>([]);
  private defaultLanguage = signal('es');
  private config = signal<any>(null);

  setLanguage(lang: string) {
    this.language.set(lang);
  }

  getLanguage() {
    return this.language() ?? this.defaultLanguage();
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
