import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { RoutesService } from './services/routes/routes.service';
import { MapperService } from 'ui-lib';

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
    MapperService,
  ],
};

export function routesInitializer(routesService: RoutesService) {
  return () => routesService.init().toPromise();
}
