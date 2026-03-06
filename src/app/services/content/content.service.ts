import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private base = environment.contentBaseUrl;
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  private fetch(url: string) {
    if (!this.cache.has(url)) {
      const request$ = this.http.get(url).pipe(shareReplay(1));

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
