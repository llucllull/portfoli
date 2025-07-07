import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

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

  getRoutes(): Observable<
    GeneralConfigResponse | HttpResponse<GeneralConfigResponse> | undefined
  > {
    return this.get<GeneralConfigResponse>(
      `${environment.apiBaseUrl}/pages?select=name,routes,home`
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
    const url = `${environment.apiBaseUrl}/page_component_translations?lang_id=eq.${langId}&page_component!inner.page_id=eq.${pageId}&select=*,page_component(*)`;
    return this.get<PageComponentTranslation[]>(url);
  }

  getPageComponents(pageId: number): Observable<PageComponent[]> {
    return this.get<PageComponent[]>(
      `${environment.apiBaseUrl}/page_components?page_id=eq.${pageId}&select=*`
    );
  }
}

export interface GeneralConfigResponse {
  id: number;
  name: string;
  favicons: string | null;
  languages: {
    id: number;
    code: string;
  }[];
  logos: string | null;
  pages: Page[];
  theme: string;
}

export interface Page {
  id: number;
  name: string;
  template: string;
}

export interface Language {
  id: number;
  code: string;
}

export interface PageComponentTranslation {
  id: number;
  page_component_id: number;
  lang_id: number;
  props: any;
  page_component?: PageComponent;
}

export interface PageComponent {
  id: number;
  page_id: number;
  component_id: number;
  order: number;
}

