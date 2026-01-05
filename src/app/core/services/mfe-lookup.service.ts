import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, lastValueFrom } from "rxjs";
import { MfeConfig } from "../models/mfe-config.model";

@Injectable({ providedIn: 'root' })
export class MfeLookupService {
    private http = inject(HttpClient);

    readonly mfeConfig = new BehaviorSubject<MfeConfig[]>([]);

    async loadMfeConfig(): Promise<MfeConfig[]> {
        const config = await lastValueFrom(
            this.http.get<MfeConfig[]>('mfe-config.json')
        );

        this.mfeConfig.next(config);
        return config;
    }
}