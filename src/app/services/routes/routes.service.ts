import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { NavigationEnd, Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ApiService } from '../api/api.service';
import { SiteConfigService } from '../site-config/site-config.service';
import { getComponent } from './component-loader';

export interface PageRoute {
  name: string;
  routes: Record<string, string>;
  home: boolean;
  template: string;
}
const ROUTES_KEY = makeStateKey<PageRoute[]>('dynamic_routes');
@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  private homeRoute: PageRoute | null = null;
  private routes$ = new BehaviorSubject<PageRoute[]>([]);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private api: ApiService,
    private siteSvc: SiteConfigService,
    private transferState: TransferState
  ) {}

  init(): Observable<PageRoute[]> {
    if (this.transferState.hasKey(ROUTES_KEY)) {
      const cached = this.transferState.get(ROUTES_KEY, []);
      this.routes$.next(cached);
      this.setAngularRoutes(cached);
      this.setupNavigationListener(cached);
      return of(cached);
    }

    return this.api.getRoutes().pipe(
      tap((routes: PageRoute[]) => {
        this.transferState.set(ROUTES_KEY, routes);
        this.routes$.next(routes);
        this.setAngularRoutes(routes);
        this.setupNavigationListener(routes);
      })
    );
  }

  private setAngularRoutes(routes: PageRoute[]) {
    const langs =
      this.siteSvc.getAvailableLanguages()?.map((l) => l.code) ?? [];
    this.homeRoute = routes.find((r) => r.home) ?? null;

    const childrenRoutes: Route[] = [];

    for (const lang of langs) {
      for (const r of routes) {
        const rawSlug = r.routes?.[lang];
        const slug = rawSlug?.replace(/^\/|\/$/g, '');
        if (!slug) continue;

        childrenRoutes.push({
          path: slug,
          loadComponent: () => getComponent(r.template),
        });
      }
    }

    const redirectLang = langs[0] ?? 'es';
    const homeSlug = this.homeRoute?.routes?.[redirectLang]?.replace(
      /^\/|\/$/g,
      ''
    );
    if (homeSlug) {
      childrenRoutes.unshift({
        path: '',
        redirectTo: homeSlug,
        pathMatch: 'full',
      });
    }

    childrenRoutes.push({
      path: '**',
      loadComponent: () =>
        import('../../pages/404/404.component').then((m) => m.ErrorComponent),
    });

    this.router.resetConfig(childrenRoutes);
    this.detectLanguageFromCurrentUrl(routes);
  }

  private setupNavigationListener(routes: PageRoute[]) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.detectLanguageFromCurrentUrl(routes);
    });
  }

  private detectLanguageFromCurrentUrl(routes: PageRoute[]) {
    const currentUrl = this.router.url;
    const availableLanguages = this.siteSvc.getAvailableLanguages();
    
    for (const lang of availableLanguages) {
      for (const route of routes) {
        const routePath = route.routes?.[lang.code];
        if (routePath && currentUrl.includes(routePath.replace(/^\/|\/$/g, ''))) {
          const currentLanguage = this.siteSvc.getCurrentLanguage();
          if (currentLanguage?.code !== lang.code) {
            this.siteSvc.setLanguage(lang);
          }
          return;
        }
      }
    }
  }
}
