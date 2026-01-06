export interface MfeConfig {
    remoteName: string;
    displayName: string;
    description: string;
    routePath: string;
    remoteEntry: string;
    exposedModule: string;
    icon: string;
    type: 'module' | 'component';
}