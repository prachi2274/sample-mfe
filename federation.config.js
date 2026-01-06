const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

const sharedMappings = shareAll({
  singleton: true,
  strictVersion: true,
  requiredVersion: 'auto',
  includeSecondaries: true,
  transient: true
});

for (const key in sharedMappings) {
  if (key.includes('@oxy-sds-coe/joule')) {
    delete sharedMappings[key];
  }
}
module.exports = withNativeFederation({
  name: 'shell-app',
  shared: {
    ...sharedMappings,
    // Explicitly force these to be singletons
    "@angular/core": { singleton: true, strictVersion: true },
    "@angular/common": { singleton: true, strictVersion: true },
    "@angular/platform-browser": { singleton: true, strictVersion: true },
    "@angular/cdk": { singleton: true, strictVersion: true },
    "@angular/material": { singleton: true, strictVersion: true },
    "@angular/cdk/a11y": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/cdk/platform": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/cdk/overlay": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    "@angular/cdk/bidi": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    // If using Material:
    "@angular/material/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  // 'skip' removes it from the Federation list, but esbuild still sees the import
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    '@fontsource-variable/material-symbols-sharp',
    '@fontsource/roboto',
    '@oxy-sds-coe/joule'
    // You can keep these here, but the real fix is below
  ],

  esbuildOptions: {
    loader: {
      '.css': 'css',
      '.woff': 'file',
      '.woff2': 'file',
      '.ttf': 'file',
      '.eot': 'file',
      '.svg': 'file',
    },
    // ADD THIS SECTION
    external: [
    ]
  },

  features: {
    ignoreUnusedDeps: true,
  }
});


