import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentStore } from '../services/content/content.store';

export const pageResolver: ResolveFn<boolean> = async (route) => {
  const store = inject(ContentStore);
  const slug = route.paramMap.get('slug') || route.routeConfig?.path || 'home';

  await store.loadPage(slug);

  return true;
};
