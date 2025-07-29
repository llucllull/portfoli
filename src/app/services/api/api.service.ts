import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  GeneralConfigResponse,
  PageComponent,
  PageComponentTranslation,
} from '@lluc_llull/ui-lib';
import { forkJoin, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageRoute } from '../routes/routes.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private headers = new HttpHeaders({
    apikey: environment.supabaseAnonKey,
    Authorization: `Bearer ${environment.supabaseAnonKey}`,
    Accept: 'application/json',
  });

  constructor(private http: HttpClient) {}

  private get<T>(url: string): Observable<T> {
    return this.http.get<T>(url, { headers: this.headers });
  }

  getGeneralConfig(): Observable<GeneralConfigResponse> {
    return this.get<GeneralConfigResponse>(`${environment.apiBaseUrl}/config`);
  }

  getRoutes(): Observable<PageRoute[]> {
    return this.get<PageRoute[]>(
      `${environment.apiBaseUrl}/pages?select=name,routes,home,template`
    );
  }

  getPageById(
    pageId: string | number | undefined
  ): Observable<any | HttpResponse<any> | undefined> {
    return this.get<any>(`${environment.apiBaseUrl}/pages?id=eq.${pageId}`);
  }

  getPageByName(
    pageName: string | number | undefined
  ): Observable<any | HttpResponse<any> | undefined> {
    return this.get<any>(`${environment.apiBaseUrl}/pages?name=eq.${pageName}`);
  }

  getPageComponentTranslations(
    pageId: number,
    langId: number
  ): Observable<PageComponentTranslation[]> {
    const url = `${environment.apiBaseUrl}/page_component_translations?lang_id=eq.${langId}&page_components.page_id=eq.${pageId}&select=*,page_components(*)`;
    return this.get<PageComponentTranslation[]>(url);
  }

  getPageComponentTranslationsByComponentIds(
    componentIds: number[],
    langId: number
  ): Observable<PageComponentTranslation[]> {
    if (!componentIds.length) return of([]);
    const ids = componentIds.join(',');
    const url =
      `${environment.apiBaseUrl}/page_component_translations` +
      `?lang_id=eq.${langId}&page_component_id=in.(${ids})` +
      `&select=id,lang_id,props,page_component:page_component_id(component:component_id(name),order)`;
    return this.get<PageComponentTranslation[]>(url);
  }

  getPageComponentTranslationsForPage(
    pageId: number,
    langId: number
  ): Observable<PageComponentTranslation[]> {
    const url =
      `${environment.apiBaseUrl}/page_component_translations` +
      `?lang_id=eq.${langId}&page_component_id.page_id=eq.${pageId}&page_component_id.isnot.null` +
      `&select=id,lang_id,props,page_component:page_component_id(component:component_id(name),order,page_id)`;
    return this.get<PageComponentTranslation[]>(url);
  }

  getPageComponents(pageId: number): Observable<PageComponent[]> {
    return this.get<PageComponent[]>(
      `${environment.apiBaseUrl}/page_components?page_id=eq.${pageId}&select=*`
    );
  }

  getNavLinks(langCode: string): Observable<any[]> {
    const url = `${environment.apiBaseUrl}/nav_link_translations?language_code=eq.${langCode}&select=label,nav_link:nav_link_id(name,linktype,children,active,order,external_url,page:page_id(routes))`;
    return this.get<any[]>(url);
  }

  getSocialLinks(langCode: string): Observable<any[]> {
    const url = `${environment.apiBaseUrl}/social_link_translations?language_code=eq.${langCode}&select=label,social_link:social_link_id(name,url,icon,order,active)`;
    return this.get<any[]>(url);
  }

  getPageByTemplate(
    template: string
  ): Observable<any | HttpResponse<any> | undefined> {
    return this.get<any>(
      `${environment.apiBaseUrl}/pages?template=eq.${template}`
    );
  }

  getLangsAndTranslations(): Observable<any[]> {
    const langs$ = this.get<any[]>(`${environment.apiBaseUrl}/lang?active=eq.true`);
    const translations$ = this.get<any[]>(`${environment.apiBaseUrl}/lang_translations`);
  
    return forkJoin([langs$, translations$]).pipe(
      map(([langs, translations]) =>
        langs.map(lang => ({
          ...lang,
          lang_translations: translations.filter(t => t.lang_code === lang.code)
        }))
      )
    );
  }
}
