import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ContentStore } from '../services/content/content.store';

@Injectable({ providedIn: 'root' })
export class pageResolver implements Resolve<boolean> {
  constructor(private store: ContentStore) {}

  async resolve(route: any): Promise<boolean> {
    const slug =
      route.paramMap.get('slug') || route.routeConfig?.path || 'home';

    await this.store.loadPage(slug);

    return true;
  }
}
