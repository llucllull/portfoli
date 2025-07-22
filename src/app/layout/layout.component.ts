import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderClearComponent, LangModalComponent } from '@lluc_llull/ui-lib';
import { Observable } from 'rxjs';
import { UiLibLangItemI } from '../../../../ui-lib/projects/ui-lib/src/lib/interfaces/ui-lib-lang-item.interface';
import { ApiService } from '../services/api/api.service';
import { LayoutService } from '../services/layout/layout.service';
import { SiteConfigService } from '../services/site-config/site-config.service';
import { Router } from '@angular/router';

const COMPONENTS = [
  HeaderClearComponent,
];

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ...COMPONENTS],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutService);
  header$: Observable<any> = this.layoutService.header$;
  footer$: Observable<any> = this.layoutService.footer$;

  currentLang: string = 'es';
  languagesFromApi: any[] = [];
  pagesFromApi: any[] = [];

  constructor(
    @Inject(MatDialog) private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private siteConfigService: SiteConfigService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.apiService.getLangsAndTranslations().subscribe((langs) => {
      this.languagesFromApi = langs;
      this.currentLang = this.siteConfigService.getCurrentLanguage()?.code || 'es';
    });
  
    this.apiService.getRoutes().subscribe((pages) => {
      this.pagesFromApi = pages;
    });
  
    this.siteConfigService.language$.subscribe((lang) => {
      this.currentLang = lang?.code || 'es';
    });
  }

  openLanguagesModal(): void {
    const dialogRef = this.dialog.open(LangModalComponent, {
      width: '400px',
      maxWidth: '90vw',
      data: {
        langs: this.languagesFromApi,
        currentLang: this.currentLang
      }
    });

    dialogRef.afterClosed().subscribe((selectedLang: UiLibLangItemI) => {
      if (selectedLang) {
        this.updateLanguage(selectedLang);
      }
    });
  }

  updateLanguage(lang: UiLibLangItemI): void {
    if (isPlatformBrowser(this.platformId)) {
      const newLang = lang.code;
      const currentUrl = this.router.url;
      // Extrae el slug actual (ej: 'ca/contacte', 'en/me', etc.)
      const currentPath = currentUrl.replace(/^\//, '');

      // Encuentra la página actual buscando el path en los valores de routes
      const currentPage = this.pagesFromApi.find((page: any) =>
        Object.values(page.routes).includes(currentPath)
      );

      let newSlug = '';
      if (currentPage && currentPage.routes && currentPage.routes[newLang]) {
        newSlug = currentPage.routes[newLang];
      }

      // Si no encuentra la página, navega solo al home del idioma
      const newUrl = newSlug ? `/${newSlug}` : `/${newLang}`;
      this.router.navigateByUrl(newUrl);
    }
  }
}