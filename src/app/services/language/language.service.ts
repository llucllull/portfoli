import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LangModalComponent } from '@lluc_llull/ui-lib/modals';
import { LayoutService } from '../layout/layout.service';
import { SiteConfigService } from '../site-config/site-config.service';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private siteConfig = inject(SiteConfigService);
  private platformId = inject(PLATFORM_ID);
  private layout = inject(LayoutService);

  openLanguagesModal() {
    const dialogRef = this.dialog.open(LangModalComponent, {
      data: {
        langs: this.siteConfig.getLanguages(),
        currentLang: this.siteConfig.getLanguage(),
      },
      enterAnimationDuration: '120ms',
      exitAnimationDuration: '100ms',
      panelClass: 'lang-modal',
      backdropClass: 'lang-backdrop',
    });

    dialogRef.afterClosed().subscribe((selected) => {
      if (!selected) return;

      this.changeLanguage(selected.code);
    });
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

      // actualizar header
      this.layout.updateHeaderLang(lang);
    });
  }
}
