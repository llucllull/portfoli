import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private base = environment.contentBaseUrl;

  constructor(private http: HttpClient) {}

  getSite() {
    return this.http.get(`${this.base}/site.json`);
  }

  getProjects() {
    return this.http.get(`${this.base}/projects.json`);
  }

  getProject(slug: string) {
    return this.http.get(`${this.base}/projects/${slug}.json`);
  }

}