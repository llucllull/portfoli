import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LangModalComponent, UiLibLangItemI } from '@lluc_llull/ui-lib';
import { SiteConfigService } from '../site-config/site-config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private siteConfig = inject(SiteConfigService);
  private platformId = inject(PLATFORM_ID);

  openLanguagesModal() {
    const dialogRef = this.dialog.open(LangModalComponent, {
      data: {
        langs: this.siteConfig.getLanguages(),
        currentLang: this.siteConfig.getLanguage(),
      },
    });

    dialogRef.afterClosed().subscribe((selected: UiLibLangItemI) => {
      if (!selected) return;

      this.changeLanguage(selected.code);
    });
  }

  changeLanguage(lang: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.siteConfig.setLanguage(lang);

    const url = this.router.url;
    const segments = url.split('/').filter(Boolean);

    if (segments.length) {
      segments[0] = lang;
    } else {
      segments.push(lang);
    }

    this.router.navigateByUrl('/' + segments.join('/'));
  }
}
