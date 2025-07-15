import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapperService } from '@lluc_llull/ui-lib';
import { combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LayoutComponent } from './layout/layout.component';
import { ApiService } from './services/api/api.service';
import { LayoutService } from './services/layout/layout.service';
import { RoutesService } from './services/routes/routes.service';
import { SiteConfigService } from './services/site-config/site-config.service';
import { TEMPLATES } from './services/routes/templates';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly siteConfig = inject(SiteConfigService);
  private readonly layoutService = inject(LayoutService);
  private readonly apiService = inject(ApiService);
  private readonly mapperService = inject(MapperService);
  private readonly routesService = inject(RoutesService);

  ngOnInit(): void {
    // Inicializa la configuración global e idioma
    this.siteConfig.init().subscribe({
      next: () => {
        // Inicializa rutas dinámicas después de tener idiomas/configuración
        this.routesService.init().subscribe();
      },
      error: (err) => {
        console.error('Error inicializando configuración global', err);
      },
    });

    // Inicializa el layout global
    combineLatest([
      this.siteConfig.getLanguage$(),
      this.apiService.getPageByTemplate(TEMPLATES.GLOBAL),
    ])
      .pipe(
        switchMap(([lang, layoutPage]: [any, any]) => {
          const page = layoutPage?.body?.[0] ?? layoutPage?.[0];
          if (!page) return of([]);

          return this.apiService.getPageComponents(page.id).pipe(
            switchMap((components) =>
              this.apiService
                .getPageComponentTranslationsByComponentIds(
                  components.map((c) => c.id),
                  lang.id
                )
                .pipe(
                  map((translations) => {
                    const componentsWithProps = translations
                      .sort(
                        (a, b) =>
                          (a.page_component?.order ?? 0) -
                          (b.page_component?.order ?? 0)
                      )
                      .map((translation) => {
                        const name = (translation.page_component as any)
                          ?.component?.name;
                        return {
                          name,
                          order: translation.page_component?.order ?? 0,
                          props: translation?.props || {},
                        };
                      });

                    const mappedComponents =
                      this.mapperService.mapComponents(componentsWithProps);

                    const headerComponent = mappedComponents.find(
                      (c) => c.name === 'header-clear'
                    );
                    if (headerComponent) {
                      this.layoutService.setHeader(headerComponent);
                    }

                    return mappedComponents;
                  })
                )
            )
          );
        })
      )
      .subscribe();
  }
}
