import { Type } from '@angular/core';

type ComponentLoader = () => Promise<Type<any>>;

export const COMPONENT_REGISTRY: Record<string, ComponentLoader> = {
  'header-clear': () =>
    import('@lluc_llull/ui-lib').then((m) => m.HeaderClearComponent),

  'header-mobile': () =>
    import('@lluc_llull/ui-lib').then((m) => m.HeaderMobileComponent),

  'hero-section': () =>
    import('@lluc_llull/ui-lib').then((m) => m.HeroSectionComponent),

  'section-intro': () =>
    import('@lluc_llull/ui-lib').then((m) => m.SectionIntroComponent),

  'category-progress': () =>
    import('@lluc_llull/ui-lib').then((m) => m.CategoryProgressComponent),
};
