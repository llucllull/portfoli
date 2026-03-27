import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom  } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { LucideAngularModule, icons } from 'lucide-angular';

import { CDN_BASE_URL, MapperService } from '@lluc_llull/ui-lib/mapper';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(MatDialogModule, LucideAngularModule.pick(icons)),
    MapperService,
    {
      provide: CDN_BASE_URL,
      useValue: environment.assetsBaseUrl
    }, provideClientHydration(withEventReplay())
  ],
};
