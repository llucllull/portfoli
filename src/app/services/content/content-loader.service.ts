import { inject, Injectable } from '@angular/core';
import { MapperService } from '@lluc_llull/ui-lib';
import { forkJoin, tap } from 'rxjs';
import { LayoutService } from '../layout/layout.service';
import { SiteConfigService } from '../site-config/site-config.service';
import { ContentService } from './content.service';

@Injectable({
  providedIn: 'root',
})
export class ContentLoaderService {
  private content = inject(ContentService);
  private siteConfig = inject(SiteConfigService);
  private layout = inject(LayoutService);
  private mapper = inject(MapperService);

  loadInitialContent() {
    return forkJoin({
      config: this.content.getConfig(),
      languages: this.content.getLanguages(),
      navigation: this.content.getNavigation(),
      social: this.content.getSocial(),
      layout: this.content.getLayout(),
    }).pipe(
      tap(({ config, languages, navigation }) => {
        this.siteConfig.setConfig(config);
        this.siteConfig.setLanguages(languages);

        const body = (navigation.body || []).map((c: any, index: number) => ({
          name: c.component,
          order: index,
          props: c.props,
        }));

        const components = this.mapper.mapComponents(body);

        const header = components.find((c) => c.name === 'header-clear');
        //footer pte

        if (header) {
          this.layout.setHeader(header);
        }

        this.layout.markLayoutAsLoaded();
      }),
    );
  }
}
