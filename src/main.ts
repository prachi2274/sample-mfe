import { initFederation } from '@angular-architects/native-federation';

fetch('/mfe-config.json')
  .then(response => response.json())
  .then(config => {
    const federationConfig: Record<string, string> = {};
    
    config.forEach((mfe: { remoteName: string; remoteEntry: string; }) => {
      federationConfig[mfe.remoteName] = mfe.remoteEntry;
    });
    
    return initFederation(federationConfig);
  })
  .catch(err => {
    console.error('Error initializing federation:', err);
  }).then(() => {
    import('./bootstrap')
      .catch(err => console.error('Error bootstrapping application:', err));
  });
