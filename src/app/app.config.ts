import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RoutesService } from './services/routes/routes.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]),
    {
      provide: APP_INITIALIZER,
      useFactory: routesInitializer,
      deps: [RoutesService],
      multi: true,
    },
    provideClientHydration(),
    provideHttpClient(withFetch()),
  ],
};

export function routesInitializer(routesService: RoutesService) {
  return () => routesService.init().toPromise();
}
