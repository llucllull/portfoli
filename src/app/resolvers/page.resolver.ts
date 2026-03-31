import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ContentStore } from '../services/content/content.store';

@Injectable({ providedIn: 'root' })
export class pageResolver implements Resolve<boolean> {
  constructor(private store: ContentStore) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    const segments = route.pathFromRoot
      .map((r) => r.url.map((u) => u.path).join('/'))
      .filter(Boolean);

    let slug = segments.join('/');

    const parts = slug.split('/');
    if (parts.length > 1) {
      slug = parts.slice(1).join('/');
    } else {
      slug = 'home';
    }

    if (!slug || slug === '**') {
      slug = '404';
    }

    console.log('🧠 Resolver slug:', slug);

    await this.store.loadPage(slug);

    return true;
  }
}
