import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MapperService } from '@lluc_llull/ui-lib/mapper';
import {
  catchError,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  tap,
  toArray,
} from 'rxjs';
import { prefetchIdle } from '../../utils/prefetch-idle';
import { resolveLang } from '../../utils/resolve-lang';
import { getSSGRoutes } from '../../utils/ssg-routes';
import { LanguageService } from '../language/language.service';
import { LayoutService } from '../layout/layout.service';
import { SiteConfigService } from '../site-config/site-config.service';
import { ContentService } from './content.service';
import { ContentStore } from './content.store';

@Injectable({
  providedIn: 'root',
})
export class ContentLoaderService {
  constructor(
    private content: ContentService,
    private siteConfig: SiteConfigService,
    private layout: LayoutService,
    private mapper: MapperService,
    private store: ContentStore,
    private language: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  loadInitialContent() {
    return forkJoin({
      config: this.content.getConfig().pipe(catchError(() => of({}))),
      languages: this.content.getLanguages().pipe(catchError(() => of({}))),
      navigation: this.content.getNavigation().pipe(catchError(() => of({}))),
      social: this.content.getSocial().pipe(catchError(() => of({}))),
      layout: this.content.getLayout().pipe(catchError(() => of({}))),
    }).pipe(
      mergeMap((baseData) => {
        // 🔥 SOLO EN SSG
        if (isPlatformServer(this.platformId)) {
          const routes = getSSGRoutes();

          const slugs = routes.map((r) => {
            const parts = r.split('/').filter(Boolean);
            if (parts.length <= 1) return 'home';
            return parts.slice(1).join('/');
          });

          return from(slugs).pipe(
            mergeMap((slug) => {
              if (slug.startsWith('projects/')) {
                return this.content.getProject(slug.split('/')[1]);
              }
              return this.content.getPage(slug);
            }, 5),
            toArray(),
            catchError(() => of([])),
            map(() => baseData),
          );
        }

        return of(baseData);
      }),
      tap(({ config, languages, navigation, layout }) => {
        const isBrowser = isPlatformBrowser(this.platformId);

        this.siteConfig.setConfig(config);
        this.siteConfig.setLanguages(languages?.languages || []);
        this.siteConfig.setDefaultLanguage(languages?.default);

        const currentLang = this.siteConfig.getCurrentLang();
        this.siteConfig.setLanguage(currentLang);

        const rawFooterProps = (layout.body || []).find(
          (c: any) => c.component === 'columns-footer',
        )?.props;

        const body = (layout.body || []).map((c: any, index: number) => {
          let props = { ...(c.props || {}) };

          if (c.component === 'header-clear') {
            props.navigation = navigation;
            props.lang = currentLang;
          }

          if (c.component === 'columns-footer') {
            props = { ...resolveLang(props, currentLang), lang: currentLang };
          }

          return {
            name: c.component,
            order: index,
            props,
          };
        });

        const components = this.mapper.mapComponents(body);
        const header = components.find((c) => c.name === 'header-clear');
        const footer = components.find((c) => c.name === 'columns-footer');

        if (header) {
          header.events = {
            langModal: () => this.language.openLanguagesModal(),
          };

          this.layout.setHeader(header);
        }

        if (footer) {
          this.layout.setFooter(footer, rawFooterProps);
        }

        this.layout.markLayoutAsLoaded();

        if (isBrowser) {
          const slugs = (navigation?.items || [])
            .map((item: any) => item.slug)
            .filter((slug: string) => slug !== 'home');

          prefetchIdle(() => {
            this.store.prefetchPages(slugs);
          });
        }
      }),
    );
  }
}
