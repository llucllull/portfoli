import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { UiLibLangItemI } from '@lluc_llull/ui-lib/interfaces';
import { mapLangModal } from '@lluc_llull/ui-lib/mapper';
import { Router } from '@angular/router';
import { LayoutService } from '../layout/layout.service';
import { SiteConfigService } from '../site-config/site-config.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  readonly isModalOpen = signal(false);
  readonly isModalClosing = signal(false);
  readonly modalLanguages = signal<UiLibLangItemI[]>([]);
  private pendingLanguage?: UiLibLangItemI;

  constructor(
    private router: Router,
    private siteConfig: SiteConfigService,
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private layout: LayoutService,
  ) {}

  openLanguagesModal() {
    if (this.isModalOpen() || this.isModalClosing()) return;

    this.modalLanguages.set(
      mapLangModal(this.siteConfig.getLanguages(), this.siteConfig.getLanguage()),
    );
    this.isModalClosing.set(false);
    this.isModalOpen.set(true);
  }

  closeLanguagesModal() {
    if (!this.isModalOpen() && !this.isModalClosing()) return;

    this.isModalClosing.set(true);
    this.isModalOpen.set(false);
  }

  selectLanguage(lang: UiLibLangItemI) {
    this.pendingLanguage = lang;
    this.closeLanguagesModal();
  }

  finishLanguagesModalClose(event: TransitionEvent) {
    if (!this.isModalClosing() || event.propertyName !== 'visibility') return;
    if (!(event.target instanceof HTMLElement) || !event.target.classList.contains('modal-content')) return;

    this.isModalClosing.set(false);

    const selected = this.pendingLanguage;
    this.pendingLanguage = undefined;
    if (selected) this.changeLanguage(selected.code);
  }

  changeLanguage(lang: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const segments = this.router.url.split('/').filter(Boolean);

    if (segments.length) {
      segments[0] = lang;
    } else {
      segments.push(lang);
    }

    const url = '/' + segments.join('/');

    this.router.navigateByUrl(url, { replaceUrl: true }).then(() => {
      this.siteConfig.setLanguage(lang);

      // actualizar header y footer
      this.layout.updateHeaderLang(lang);
      this.layout.updateFooterLang(lang);
    });
  }
}
