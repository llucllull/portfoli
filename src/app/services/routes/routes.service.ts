import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { ApiService } from '../api/api.service';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Route, Router } from '@angular/router';
import { SiteConfigService } from '../site-config/site-config.service';
import { getComponent } from './component-loader';
import { LayoutComponent } from '../../layout/layout.component';

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
      return of(cached);
    }

    return this.api.getRoutes().pipe(
      tap((routes: PageRoute[]) => {
        this.transferState.set(ROUTES_KEY, routes);
        this.routes$.next(routes);
        this.setAngularRoutes(routes);
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
  }
}
