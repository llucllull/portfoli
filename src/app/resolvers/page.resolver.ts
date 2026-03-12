import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ContentStore } from '../services/content/content.store';

export const pageResolver: ResolveFn<boolean> = async (route) => {
  const store = inject(ContentStore);

  const lang = route.paramMap.get('lang');
  const slug = route.routeConfig?.path?.includes(':slug')
    ? route.paramMap.get('slug')
    : route.routeConfig?.path;

  let finalSlug = 'home';

  if (slug) finalSlug = slug;
  if (!slug && route.routeConfig?.path === '') finalSlug = 'home';

  await store.loadPage(finalSlug);

  return true;
};
