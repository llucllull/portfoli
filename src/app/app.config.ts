import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { CDN_BASE_URL, MapperService } from '@lluc_llull/ui-lib';
import { routes } from './app.routes';
import { environment } from '../environments/environment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimationsAsync(),
    MapperService,
    {
      provide: CDN_BASE_URL,
      useValue: environment.assetsBaseUrl
    }
  ],
};
