import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Route, Router, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MfeLookupService } from './core/services/mfe-lookup.service';
import { MfeConfig } from './core/models/mfe-config.model';
import { initFederation, loadRemoteModule } from '@angular-architects/native-federation';
import { LaunchpadComponent } from './features/launchpad.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (mfeService: MfeLookupService, router: Router) => () => {
        return mfeService.loadMfeConfig().then(async (mfes: MfeConfig[]) => {

          const dynamicRoutes: Routes = mfes.map(mfe => {
            const route: Route = {
              path: mfe.routePath
            };
            if (mfe.type === 'module') {
              route.loadChildren = () =>
                loadRemoteModule({
                  remoteName: mfe.remoteName,
                  exposedModule: mfe.exposedModule
                }).then(m => m.routes || m.default);
            } else if (mfe.type === 'component') {
              route.loadComponent = () =>
                loadRemoteModule({
                  remoteName: mfe.remoteName,
                  exposedModule: mfe.exposedModule
                }).then(m => m.default);
            }
            return route;
          });

          router.resetConfig([
            { path: '', component: LaunchpadComponent },
            ...dynamicRoutes
          ]);

        });
      },
      deps: [MfeLookupService, Router],
    },
    provideRouter(routes),
  ]
};
