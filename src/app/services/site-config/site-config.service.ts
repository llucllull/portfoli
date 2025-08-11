import { isPlatformBrowser } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { GeneralConfigResponse, Language } from '@lluc_llull/ui-lib';
import {
  BehaviorSubject,
  catchError,
  tap,
  throwError,
} from 'rxjs';
import {
  ApiService,
} from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class SiteConfigService {
  private config$ = new BehaviorSubject<GeneralConfigResponse | undefined>(
    undefined
  );
  public language$ = new BehaviorSubject<Language | null>(null);

  constructor(
    private api: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject('REQUEST_LANGUAGE') private requestLanguage: string
  ) {}

  init() {
    return this.api.getGeneralConfig().pipe(
      tap((config) => {
        // Si es HttpResponse, saca el body
        const data = (config as any).body ? (config as any).body : config;
        const languages = data?.[0]?.languages ?? [];
        this.config$.next(data);

        // Actualizar favicons si están disponibles en la configuración
        if (data?.[0]?.favicons) {
          this.updateFavicons(data[0].favicons);
        }

        if (languages.length === 0) {
          console.warn(
            'La lista de idiomas está vacía, se usará un idioma por defecto'
          );
          const defaultLang = { id: 1, code: 'es' };
          this.language$.next(defaultLang);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('language', JSON.stringify(defaultLang));
          }
        } else {
          const selectedLanguage = this.detectLanguage(languages);
          this.language$.next(selectedLanguage);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('language', JSON.stringify(selectedLanguage));
          }
        }
      }),
      catchError((error) => {
        console.error('Error cargando configuración', error);
        return throwError(() => error);
      })
    );
  }

  private detectLanguage(languages: Language[]): Language {
    if (!languages || languages.length === 0) {
      return { id: 1, code: 'es' };
    }

    // SSR: usa el idioma de la cabecera
    if (!isPlatformBrowser(this.platformId) && this.requestLanguage) {
      const code = this.requestLanguage.split(',')[0].slice(0, 2);
      const found = languages.find((l) => l.code === code);
      if (found) return found;
    }

    // Cliente: localStorage o navegador
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('language');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Language;
          const exists = languages.find((l) => l.code === parsed.code);
          if (exists) return exists;
        } catch {
          localStorage.removeItem('language');
        }
      }
      const browserCode = navigator.language.slice(0, 2);
      const fromBrowser = languages.find((l) => l.code === browserCode);
      if (fromBrowser) return fromBrowser;
    }

    return languages[0];
  }

  getConfig$() {
    return this.config$.asObservable();
  }

  getLanguage$() {
    return this.language$.asObservable();
  }

  getCurrentLanguage(): Language | null {
    return this.language$.value;
  }

  getCurrentConfig():
    | GeneralConfigResponse
    | HttpResponse<GeneralConfigResponse>
    | undefined
    | null {
    return this.config$.value;
  }

  setLanguage(language: Language) {
    this.language$.next(language);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', JSON.stringify(language));
    }
  }

  getAvailableLanguages(): Language[] {
    const config: any = this.config$.value;
    return config?.[0]?.languages ?? [];
  }

  private updateFavicons(faviconConfig: { ico: string; svg: string }): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const svgUrl = this.buildFaviconUrl(faviconConfig.svg);
      const icoUrl = this.buildFaviconUrl(faviconConfig.ico);

      this.updateFaviconLink('icon', svgUrl, 'image/svg+xml');
      this.updateFaviconLink('icon', icoUrl, 'image/x-icon');
    } catch (error) {
      console.error('Error actualizando favicons:', error);
    }
  }

  private buildFaviconUrl(faviconPath: string): string {
    if (faviconPath.startsWith('http://') || faviconPath.startsWith('https://')) {
      return faviconPath;
    }

    const baseUrl = window.location.origin;

    if (faviconPath.startsWith('/')) {
      return `${baseUrl}${faviconPath}`;
    }

    // Si empieza con 'branding/', asumir que está en assets
    if (faviconPath.startsWith('branding/')) {
      return `${baseUrl}/assets/${faviconPath}`;
    }

    // Para otras rutas relativas, también asumir assets
    return `${baseUrl}/assets/${faviconPath}`;
  }

  private updateFaviconLink(rel: string, href: string, type: string): void {
    const head = document.head;
    
    let existingLink = head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
    
    if (existingLink) {
      existingLink.href = href;
      existingLink.type = type;
    } else {
      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      link.type = type;
      head.appendChild(link);
    }
  }

  updateFaviconsFromConfig(): void {
    const config: any = this.config$.value;
    if (config?.[0]?.favicons) {
      this.updateFavicons(config[0].favicons);
    }
  }

  restoreDefaultFavicons(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      this.updateFaviconLink('icon', 'assets/favicons/favicon.svg', 'image/svg+xml');
      this.updateFaviconLink('icon', 'assets/favicons/favicon.ico', 'image/x-icon');
    } catch (error) {
      console.error('Error restaurando favicons por defecto:', error);
    }
  }
}
