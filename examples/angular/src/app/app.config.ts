import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
  ],
};
