import { Type } from '@angular/core';

type ComponentLoader = () => Promise<Type<any>>;

export const COMPONENT_REGISTRY: Record<string, ComponentLoader> = {
  'header-clear': () =>
    import('@lluc_llull/ui-lib/headers/header-clear').then((m) => m.HeaderClearComponent),

  'header-mobile': () =>
    import('@lluc_llull/ui-lib/headers/header-mobile').then((m) => m.HeaderMobileComponent),

  'columns-footer': () =>
    import('@lluc_llull/ui-lib/footers/columns-footer').then((m) => m.ColumnsFooterComponent),

  'hero-section': () =>
    import('@lluc_llull/ui-lib/content/hero-section').then((m) => m.HeroSectionComponent),

  'section-intro': () =>
    import('@lluc_llull/ui-lib/content/section-intro').then((m) => m.SectionIntroComponent),

  'category-progress': () =>
    import('@lluc_llull/ui-lib/content/category-progress').then((m) => m.CategoryProgressComponent),

  'not-found': () =>
    import('@lluc_llull/ui-lib/feedback/404').then((m) => m.NotFoundComponent),

  'split-previewer': () =>
    import('@lluc_llull/ui-lib/content/split-previewer').then((m) => m.SplitPreviewerComponent),

  'contact-minimal': () =>
    import('@lluc_llull/ui-lib/content/contact-minimal').then((m) => m.ContactMinimalComponent),

  'media-split': () =>
    import('@lluc_llull/ui-lib/content/media-split').then((m) => m.MediaSplitComponent),

  'stacked-rows': () =>
    import('@lluc_llull/ui-lib/content/stacked-rows').then((m) => m.StackedRowsComponent),

  'mosaic-parallax': () =>
    import('@lluc_llull/ui-lib/content/mosaic-parallax').then((m) => m.MosaicParallaxComponent),

  'content-document': () =>
    import('@lluc_llull/ui-lib/content/content-document').then((m) => m.ContentDocumentComponent),

  'split-showcase': () =>
    import('@lluc_llull/ui-lib/content/split-showcase').then((m) => m.SplitShowcaseComponent),

  'asymmetric-media': () =>
    import('@lluc_llull/ui-lib/content/asymmetric-media').then((m) => m.AsymmetricMediaComponent),

  'media-intro': () =>
    import('@lluc_llull/ui-lib/content/media-intro').then((m) => m.MediaIntroComponent),

  'columns-media-stacked': () =>
    import('@lluc_llull/ui-lib/content/columns-media-stacked').then((m) => m.ColumnsMediaStackedComponent),
};

export const COMPONENT_CACHE: Record<string, Type<any>> = {};

export async function preloadComponents() {
  await Promise.all(
    Object.entries(COMPONENT_REGISTRY).map(async ([key, loader]) => {
      COMPONENT_CACHE[key] = await loader();
    }),
  );
}
