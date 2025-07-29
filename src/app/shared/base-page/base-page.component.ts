import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BodyComponent, MapperService } from '@lluc_llull/ui-lib';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../services/api/api.service';
import { RoutesService } from '../../services/routes/routes.service';
import { SiteConfigService } from '../../services/site-config/site-config.service';

interface PageConfig {
  id: number;
  name: string;
  template: string;
  body: BodyComponent<any>[];
}

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [CommonModule],
  template: '',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasePageComponent implements OnInit {
  protected readonly siteConfig = inject(SiteConfigService);
  protected readonly routesService = inject(RoutesService);
  protected readonly apiService = inject(ApiService);
  protected readonly route = inject(ActivatedRoute);
  protected readonly mapperService = inject(MapperService);

  pageConfig$!: Observable<PageConfig | null>;

  ngOnInit(): void {
    this.pageConfig$ = combineLatest([
      this.route.url,
      this.siteConfig.getLanguage$().pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([urlSegments, currentLanguage]) => {
        // Obtener el path actual de la URL
        const currentPath = urlSegments.map(segment => segment.path).join('/');
        
        // Buscar la página que corresponde a este path
        return this.apiService.getRoutes().pipe(
          switchMap((routes) => {
            const currentPage = routes.find(route => 
              Object.values(route.routes).some(routePath => 
                routePath.replace(/^\/|\/$/g, '') === currentPath
              )
            );
            
            const pageName = currentPage?.name || 'home';
            
            return this.apiService.getPageByName(pageName).pipe(
              switchMap((pageResponse) => {
                const page = (pageResponse as any)?.body
                  ? (pageResponse as any).body
                  : pageResponse;
                const pageData = page?.[0];


                if (!pageData) return of(null);

                return this.apiService.getPageComponents(pageData.id).pipe(
                  switchMap((components) => {
                    const componentIds = components.map((c) => c.id);
                    const langId = currentLanguage?.id || 1;
                    
                    if (componentIds.length === 0) {
                      return of({
                        ...pageData,
                        body: [],
                      });
                    }
                    
                    return this.apiService
                      .getPageComponentTranslationsByComponentIds(componentIds, langId)
                      .pipe(
                        map((translations) => {
                          const componentsWithProps = translations
                            .sort((a, b) => (a.page_component?.order ?? 0) - (b.page_component?.order ?? 0))
                            .map((translation) => {
                              const name = translation.page_component?.component?.name;
                              return {
                                name,
                                order: translation.page_component?.order ?? 0,
                                props: translation?.props || {},
                              };
                            });
                          const bodyComponents = this.mapperService.mapComponents(componentsWithProps);
                          return {
                            ...pageData,
                            body: bodyComponents,
                          };
                        }),
                        catchError((error) => {
                          console.error('Error loading page components:', error);
                          return of({
                            ...pageData,
                            body: [],
                          });
                        })
                      );
                  }),
                  catchError((error) => {
                    console.error('Error loading page components:', error);
                    return of({
                      ...pageData,
                      body: [],
                    });
                  })
                );
              }),
              catchError((error) => {
                console.error('Error loading page:', error);
                return of(null);
              })
            );
          })
        );
      })
    );
  }

  getTitle(): string {
    const currentConfig = this.siteConfig.getCurrentConfig();
    const data = (currentConfig as any)?.body
      ? (currentConfig as any).body
      : currentConfig;
    return data?.[0]?.name || 'Portfolio';
  }

  getComponentList(): any[] {
    return [];
  }
}
