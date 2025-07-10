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
    const lang = this.siteSvc.getCurrentLanguage()?.code ?? 'es';
    this.homeRoute = routes.find((r) => r.home) ?? null;

    const childrenRoutes: Route[] = routes
      .map((r) => {
        const rawSlug = r.routes[lang];
        const slug = rawSlug?.replace(/^\/|\/$/g, '');
        if (!slug) return null;

        return {
          path: slug,
          loadComponent: () => getComponent(r.template),
        };
      })
      .filter(Boolean) as Route[];

    if (this.homeRoute?.routes?.[lang]) {
      const homeSlug = this.homeRoute.routes[lang].replace(/^\/|\/$/g, '');
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

    const angularRoutes: Route[] = routes
      .map((r) => {
        const rawSlug = r.routes[lang];
        const slug = rawSlug?.replace(/^\/|\/$/g, '');
        if (!slug) return null;

        return {
          path: slug,
          loadComponent: () => getComponent(r.template),
        };
      })
      .filter(Boolean) as Route[];

    if (this.homeRoute?.routes?.[lang]) {
      const homeSlug = this.homeRoute.routes[lang].replace(/^\/|\/$/g, '');
      angularRoutes.unshift({
        path: '',
        redirectTo: homeSlug,
        pathMatch: 'full',
      });
    }

    angularRoutes.push({
      path: '**',
      loadComponent: () =>
        import('../../pages/404/404.component').then((m) => m.ErrorComponent),
    });

    this.router.resetConfig(angularRoutes);
  }
}
