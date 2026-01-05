import { Component, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MfeLookupService } from "../core/services/mfe-lookup.service";
import { HttpClient } from "@angular/common/http";

@Component({
    selector: 'app-launchpad',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './launchpad.component.html',
    styleUrl: './launchpad.component.scss',
    providers: [MfeLookupService, HttpClient ]
})
export class LaunchpadComponent {
    mfeService = inject(MfeLookupService);
    router = inject(Router);
    route = inject(ActivatedRoute);

    constructor(){
        //this.mfeService.loadMfeConfig();
    }

    navigateToApp(appRoutePath: string) {
        this.router.navigate([appRoutePath], { relativeTo: this.route });
    }
}