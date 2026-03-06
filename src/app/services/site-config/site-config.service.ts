import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SiteConfigService {
  private language = signal('es');
  private languages = signal<any[]>([]);
  private config = signal<any>(null);

  setLanguage(lang: string) {
    this.language.set(lang);
  }

  getLanguage() {
    return this.language();
  }

  setLanguages(langs: any[]) {
    this.languages.set(langs);
  }

  getLanguages() {
    return this.languages();
  }

  setConfig(config: any) {
    this.config.set(config);
  }

  getConfig() {
    return this.config();
  }
}
