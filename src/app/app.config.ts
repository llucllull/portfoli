import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideAppInitializer } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { icons, LucideAngularModule } from 'lucide-angular';

import { MatDialogModule } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { CDN_BASE_URL, MapperService } from '@lluc_llull/ui-lib/mapper';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { SeoService } from './services/seo/seo.service';
import { preloadComponents } from './shared/dynamic-renderer/component-registry.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => preloadComponents()), 
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    importProvidersFrom(MatDialogModule, LucideAngularModule.pick(icons)),
    MapperService,
    SeoService,
    Title,
    Meta,
    {
      provide: CDN_BASE_URL,
      useValue: environment.assetsBaseUrl,
    },
    provideClientHydration(withEventReplay()),
  ],
};
