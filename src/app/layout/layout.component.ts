import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { BodyComponent } from '@lluc_llull/ui-lib/interfaces';
import { ScreenSizerService } from '@lluc_llull/ui-lib/screen-sizer';
import { LayoutService } from '../services/layout/layout.service';
import { SiteConfigService } from '../services/site-config/site-config.service';
import { DynamicRendererComponent } from '../shared/dynamic-renderer/dynamic-renderer.component';
import { LanguageService } from '../services/language/language.service';
import { LangModalComponent } from '@lluc_llull/ui-lib/modals';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, DynamicRendererComponent, LangModalComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  constructor(
    protected screen: ScreenSizerService,
    protected layout: LayoutService,
    protected language: LanguageService,
    private siteConfig: SiteConfigService,
  ) {}

  currentLang = this.siteConfig.getLanguage();
  platformId = inject(PLATFORM_ID);
  mobileHeader = computed<BodyComponent<any>>(() => {
    const header = this.layout.header();

    return {
      ...header!,
      name: 'header-mobile',
    };
  });

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
