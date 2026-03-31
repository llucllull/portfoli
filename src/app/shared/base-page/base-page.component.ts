import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { MapperService } from '@lluc_llull/ui-lib/mapper';
import { ContentStore } from '../../services/content/content.store';
import { SiteConfigService } from '../../services/site-config/site-config.service';
import { resolveLang } from '../../utils/resolve-lang';
import { DynamicRendererComponent } from '../dynamic-renderer/dynamic-renderer.component';

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [CommonModule, DynamicRendererComponent],
  templateUrl: './base-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePageComponent {
  private url = toSignal(this.route.url, { initialValue: [] });
  private params = toSignal(this.route.paramMap, { initialValue: null });

  slug = computed(() => {
    const url = this.url();

    if (!url || url.length === 0) return 'home';

    const parts = url.map((u) => u.path).filter(Boolean);

    if (parts.length <= 1) return 'home';

    return parts.slice(1).join('/');
  });

  constructor(
    protected route: ActivatedRoute,
    protected store: ContentStore,
    protected mapper: MapperService,
    protected siteConfig: SiteConfigService,
    protected router: Router,
  ) {
    effect(() => {
      const params = this.params();

      if (!params) return;

      const lang = params.get('lang');

      const langs = this.siteConfig.getLanguages()?.map((l) => l.code) ?? [];

      if (lang && langs.includes(lang)) {
        this.siteConfig.setLanguage(lang);
      }
    });
  }

  page = computed(() => {
    const slug = this.slug();
    let page = this.store.page(slug);

    if (!page) {
      page = this.store.page('404');
    }

    if (!page) {
      return {
        body: [],
      };
    }

    const lang = this.siteConfig.getLanguage();

    const body = (page.body || []).map((c: any, index: number) => ({
      name: c.component,
      order: index,
      props: resolveLang(c.props, lang),
    }));

    return {
      ...page,
      body: this.mapper.mapComponents(body),
    };
  });
}
