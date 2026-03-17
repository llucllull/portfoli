import { inject, Injectable } from '@angular/core';
import { MapperService } from '@lluc_llull/ui-lib/mapper';
import { forkJoin, tap } from 'rxjs';
import { prefetchIdle } from '../../utils/prefetch-idle';
import { LanguageService } from '../language/language.service';
import { LayoutService } from '../layout/layout.service';
import { SiteConfigService } from '../site-config/site-config.service';
import { ContentService } from './content.service';
import { ContentStore } from './content.store';

@Injectable({
  providedIn: 'root',
})
export class ContentLoaderService {
  private content = inject(ContentService);
  private siteConfig = inject(SiteConfigService);
  private layout = inject(LayoutService);
  private mapper = inject(MapperService);
  private store = inject(ContentStore);
  private language = inject(LanguageService);

  loadInitialContent() {
    return forkJoin({
      config: this.content.getConfig(),
      languages: this.content.getLanguages(),
      navigation: this.content.getNavigation(),
      social: this.content.getSocial(),
      layout: this.content.getLayout(),
    }).pipe(
      tap(({ config, languages, navigation, layout }) => {
        this.siteConfig.setConfig(config);
        this.siteConfig.setLanguages(languages.languages);
        this.siteConfig.setDefaultLanguage(languages.default);

        const currentLang = this.siteConfig.getCurrentLang();
        
        this.siteConfig.setLanguage(currentLang);

        const body = (layout.body || []).map((c: any, index: number) => {
          const props = { ...(c.props || {}) };

          if (c.component === 'header-clear') {
            props.navigation = navigation;
            props.lang = this.siteConfig.getCurrentLang();
          }

          return {
            name: c.component,
            order: index,
            props,
          };
        });

        const components = this.mapper.mapComponents(body);
        const header = components.find((c) => c.name === 'header-clear');

        if (header) {
          header.events = {
            langModal: () => this.language.openLanguagesModal(),
          };

          this.layout.setHeader(header);
        }

        this.layout.markLayoutAsLoaded();

        const slugs = navigation.items
          .map((item: any) => item.slug)
          .filter((slug: string) => slug !== 'home');

        prefetchIdle(() => {
          this.store.prefetchPages(slugs);
        });
      }),
    );
  }
}
