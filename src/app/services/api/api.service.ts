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

  getGeneralConfig(): Observable<GeneralConfigResponse | HttpResponse<GeneralConfigResponse> | undefined> {
    return this.http.get<GeneralConfigResponse>(
      `${environment.apiBaseUrl}/config`,
      { headers: this.headers }
    );
  }

  getRoutes(): Observable<GeneralConfigResponse | HttpResponse<GeneralConfigResponse> | undefined> {
    return this.http.get<GeneralConfigResponse>(
      `${environment.apiBaseUrl}/pages?select=name,routes`,
      { headers: this.headers }
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
