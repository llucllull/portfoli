import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom
} from '@angular/core';
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
import { CDN_BASE_URL, MapperService } from '@lluc_llull/ui-lib/mapper';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(MatDialogModule, LucideAngularModule.pick(icons)),
    MapperService,
    {
      provide: CDN_BASE_URL,
      useValue: environment.assetsBaseUrl,
    },
    provideClientHydration(withEventReplay()),
  ],
};
