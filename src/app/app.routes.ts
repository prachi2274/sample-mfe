import { Routes } from '@angular/router';
import { LaunchpadComponent } from './features/launchpad.component';
import { loadRemoteModule } from '@angular-architects/native-federation';

export const routes: Routes = [
    {
        path: '',
        component: LaunchpadComponent
    },
    {
        path: 'pcd',
        loadChildren: () =>
            loadRemoteModule({
                remoteName: 'oxy-pcd-standalone-joule',
                exposedModule: './Routes'
            }).then(m => m.routes || m.default)

    }
];
