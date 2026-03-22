import { Type } from '@angular/core';

type ComponentLoader = () => Promise<Type<any>>;

export const COMPONENT_REGISTRY: Record<string, ComponentLoader> = {
  'header-clear': () =>
    import('@lluc_llull/ui-lib/headers').then((m) => m.HeaderClearComponent),

  'header-mobile': () =>
    import('@lluc_llull/ui-lib/headers').then((m) => m.HeaderMobileComponent),

  'hero-section': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.HeroSectionComponent),

  'section-intro': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.SectionIntroComponent),

  'category-progress': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.CategoryProgressComponent),

  'not-found': () =>
    import('@lluc_llull/ui-lib/feedback').then((m) => m.NotFoundComponent),
};

export const COMPONENT_CACHE: Record<string, Type<any>> = {};

export async function preloadComponents() {
  const entries = Object.entries(COMPONENT_REGISTRY);

  for (const [key, loader] of entries) {
    COMPONENT_CACHE[key] = await loader();
  }
}