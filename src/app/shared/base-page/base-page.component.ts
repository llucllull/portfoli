import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import { MapperService } from '@lluc_llull/ui-lib';
import { ContentStore } from '../../services/content/content.store';
import { SiteConfigService } from '../../services/site-config/site-config.service';
import { DynamicRendererComponent } from '../dynamic-renderer/dynamic-renderer.component';

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [CommonModule, DynamicRendererComponent],
  templateUrl: './base-page.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePageComponent {
  protected route = inject(ActivatedRoute);
  protected store = inject(ContentStore);
  protected mapper = inject(MapperService);
  protected siteConfig = inject(SiteConfigService);

  private url = toSignal(this.route.url);
  private params = toSignal(this.route.paramMap);

  slug = computed(() => {
    const segments = this.url();
    return segments?.map((s) => s.path).join('/') || 'home';
  });

  constructor() {
    effect(
      () => {
        const lang = this.params()?.get('lang') || 'es';
        this.siteConfig.setLanguage(lang);
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        const slug = this.slug();
        this.store.loadPage(slug);
      },
      { allowSignalWrites: true },
    );
  }

  page = computed(() => {

  const slug = this.slug();
  const page = this.store.page(slug);

  if (!page) return null;

  const lang = this.siteConfig.getLanguage();

  const body = page.body.map((c: any, index: number) => ({
    name: c.component,
    order: index,
    props: this.store.resolveLang(c.props, lang)
  }));

  return {
    ...page,
    body: this.mapper.mapComponents(body)
  };

});
}
