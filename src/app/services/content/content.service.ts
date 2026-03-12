import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, TransferState, inject, makeStateKey } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private http = inject(HttpClient);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  private base = environment.contentBaseUrl;
  private cache = new Map<string, Observable<any>>();

  private fetch(url: string) {
    const key = makeStateKey<any>(url);

    // si el navegador ya tiene los datos prerender
    if (this.transferState.hasKey(key)) {
      const data = this.transferState.get(key, null);
      this.transferState.remove(key);
      return new Observable((observer) => {
        observer.next(data);
        observer.complete();
      });
    }

    if (!this.cache.has(url)) {
      const request$ = this.http.get(url).pipe(
        tap((data) => {
          // durante SSG guardamos el resultado
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(key, data);
          }
        }),

        shareReplay({
          bufferSize: 1,
          refCount: false,
        }),
      );

      this.cache.set(url, request$);
    }

    return this.cache.get(url)!;
  }

  getConfig() {
    return this.fetch(`${this.base}/config.json`);
  }

  getLanguages() {
    return this.fetch(`${this.base}/languages.json`);
  }

  getNavigation() {
    return this.fetch(`${this.base}/navigation.json`);
  }

  getSocial() {
    return this.fetch(`${this.base}/social.json`);
  }

  getLayout() {
    return this.fetch(`${this.base}/layout.json`);
  }

  getPage(page: string) {
    return this.fetch(`${this.base}/pages/${page}.json`);
  }

  getProjects() {
    return this.fetch(`${this.base}/projects/projects.json`);
  }

  getProject(project: string) {
    return this.fetch(`${this.base}/projects/${project}.json`);
  }
}
