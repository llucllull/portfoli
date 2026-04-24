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
    import('@lluc_llull/ui-lib/content').then(
      (m) => m.CategoryProgressComponent,
    ),

  'not-found': () =>
    import('@lluc_llull/ui-lib/feedback').then((m) => m.NotFoundComponent),

  'split-previewer': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.SplitPreviewerComponent),

  'contact-minimal': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.ContactMinimalComponent),
  
  'media-split': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.MediaSplitComponent),

  'stacked-rows': () =>
    import('@lluc_llull/ui-lib/content').then((m) => m.StackedRowsComponent),
};

export const COMPONENT_CACHE: Record<string, Type<any>> = {};

export async function preloadComponents() {
  await Promise.all(
    Object.entries(COMPONENT_REGISTRY).map(async ([key, loader]) => {
      COMPONENT_CACHE[key] = await loader();
    }),
  );
}
