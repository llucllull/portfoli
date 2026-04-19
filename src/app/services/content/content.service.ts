import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  PLATFORM_ID,
  TransferState
} from '@angular/core';
import {
  catchError,
  first,
  Observable,
  of,
  shareReplay,
  timeout
} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private base = environment.contentBaseUrl;
  private cache = new Map<string, { obs: Observable<any>; time: number }>();
  private TTL = 1000 * 60 * 5;

  constructor(
    private http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
  ) {}

  private fetch(url: string) {
    const now = Date.now();

    const cached = this.cache.get(url);

    if (cached && now - cached.time < this.TTL) {
      return cached.obs;
    }

    const finalUrl = `${url}?v=${Math.floor(now / this.TTL)}`;

    const request$ = this.http.get(finalUrl).pipe(
      timeout(5000),
      first(),

      catchError((error) => {
        console.error(`⚠️ Error en Fetch (${url}):`, error.status);
        return of({});
      }),

      shareReplay(1),
    );

    this.cache.set(url, { obs: request$, time: now });

    return request$;
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
    return this.fetch(`${this.base}/pages/projects.json`);
  }

  getProject(project: string) {
    return this.fetch(`${this.base}/projects/${project}.json`);
  }
}
