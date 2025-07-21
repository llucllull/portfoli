import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RoutesService } from './services/routes/routes.service';
import { MapperService } from '@lluc_llull/ui-lib';
import { SiteConfigService } from './services/site-config/site-config.service';
import { firstValueFrom } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [SiteConfigService, RoutesService],
      multi: true,
    },
    provideClientHydration(),
    provideHttpClient(withFetch()),
    MapperService, provideAnimationsAsync(),
  ],
};

export function appInitializer(
  siteConfig: SiteConfigService,
  routes: RoutesService
) {
  return async () => {
    await firstValueFrom(siteConfig.init());
    await firstValueFrom(routes.init());
  };
}
