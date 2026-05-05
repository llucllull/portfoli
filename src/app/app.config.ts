import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration,
} from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideRouter,
  withInMemoryScrolling
} from '@angular/router';
import { icons, LucideAngularModule } from 'lucide-angular';

import { MatDialogModule } from '@angular/material/dialog';
import { Meta, Title } from '@angular/platform-browser';
import { CDN_BASE_URL, CLOUDINARY_CLOUD_NAME, MapperService } from '@lluc_llull/ui-lib/mapper';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { SeoService } from './services/seo/seo.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
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
    {
      provide: CLOUDINARY_CLOUD_NAME,
      useValue: 'dmbw78o1u',
    },
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
  ],
};
