import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
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
import { ArrowRight, ArrowUpRight, LucideAngularModule } from 'lucide-angular';

import { MatDialogModule } from '@angular/material/dialog';
import { CDN_BASE_URL, MapperService } from '@lluc_llull/ui-lib/mapper';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { ContentLoaderService } from './services/content/content-loader.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      const loader = inject(ContentLoaderService);

      await firstValueFrom(loader.loadInitialContent());
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAnimationsAsync(),
    importProvidersFrom(
      MatDialogModule,
      LucideAngularModule.pick({ ArrowRight, ArrowUpRight }),
    ),
    MapperService,
    {
      provide: CDN_BASE_URL,
      useValue: environment.assetsBaseUrl,
    },
    provideClientHydration(withEventReplay()),
  ],
};
