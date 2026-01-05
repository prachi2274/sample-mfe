import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Router, Routes } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { MfeLookupService } from './core/services/mfe-lookup.service';
import { MfeConfig } from './core/models/mfe-config.model';
import { initFederation, loadRemoteModule } from '@angular-architects/native-federation';
import { LaunchpadComponent } from './features/launchpad.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: (mfeService: MfeLookupService, router: Router) => () => {
        return mfeService.loadMfeConfig().then(async (mfes: MfeConfig[]) => {
          const federationManifest: Record<string, string> = {};

          mfes.forEach(mfe => {
            // SAFETY CHECK: Ensure we aren't pointing to the shell's own port by mistake
            if (mfe.remoteEntry.includes('localhost:4200')) {
              console.warn(`⚠️ Potential Config Error: Remote ${mfe.remoteName} is pointing to Shell port 4200.`);
            }
            federationManifest[mfe.remoteName] = mfe.remoteEntry;
          });

          try {
            // Await the initialization
            await initFederation(federationManifest);

            const dynamicRoutes: Routes = mfes.map(mfe => ({
              path: mfe.routePath,
              loadChildren: () =>
                loadRemoteModule({
                  remoteName: mfe.remoteName,
                  exposedModule: mfe.exposedModule
                }).then(m => m.routes || m.default)
            }));

            router.resetConfig([
              { path: '', component: LaunchpadComponent, pathMatch: 'full' },
              ...dynamicRoutes
            ]);

          } catch (err) {
            // This catches the "Unexpected token" error if a remote is down
            console.error('Federation Init Failed:', err);
          }
        });
      },
      deps: [MfeLookupService, Router],
    },
    provideRouter(routes),
  ]
};
