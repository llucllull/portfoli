import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private base = environment.contentBaseUrl;

  constructor(private http: HttpClient) {}

  getConfig() {
    return this.http.get(`${this.base}/config.json`);
  }

  getLanguages() {
    return this.http.get(`${this.base}/languages.json`);
  }

  getNavigation() {
    return this.http.get(`${this.base}/navigation.json`);
  }

  getSocial() {
    return this.http.get(`${this.base}/social.json`);
  }

  getPage(page: string) {
    return this.http.get(`${this.base}/pages/${page}.json`);
  }

  getProjects() {
    return this.http.get(`${this.base}/projects/projects.json`);
  }

  getProject(project: string) {
    return this.http.get(`${this.base}/projects/${project}.json`);
  }
}
