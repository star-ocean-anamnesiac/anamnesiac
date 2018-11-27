import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ngsw-worker.js')
      .then(() => console.log('Service worker installed!'))
      .catch(err => console.error('Error', err));
  }
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
