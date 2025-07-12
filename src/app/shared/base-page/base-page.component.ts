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
      this.route.params,
      this.siteConfig.getLanguage$().pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([params, currentLanguage]) => {
        const pageName = params['page'] || 'home';
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
                return this.apiService
                  .getPageComponentTranslationsByComponentIds(
                    componentIds,
                    langId
                  )
                  .pipe(
                    map((translations) => {
                      const bodyComponents = this.mapComponentsToBody(
                        components,
                        translations
                      );
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
  }

  private mapComponentsToBody(
    components: any[],
    translations: any[]
  ): BodyComponent<any>[] {
    if (!components || !translations) return [];

    const componentsWithProps = components
      .sort((a, b) => a.order - b.order)
      .map((component) => {
        const translation = translations.find(
          (t) => t.page_component_id === component.id
        );
        
        let name = `component-${component.component_id}`;
        if (translation?.page_component?.component?.name) {
          name = translation.page_component.component.name;
        }
        return {
          name,
          order: component.order,
          props: translation?.props || {},
        };
      });

    const mappedComponents = this.mapperService.mapComponents(componentsWithProps);
    
    return mappedComponents;
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
