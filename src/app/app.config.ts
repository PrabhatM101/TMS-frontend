import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './shared/interceptors/request-interceptor';
import { errorInterceptor } from './shared/interceptors/error-interceptor';
import { AppErrorHandler } from './shared/error/app-error-handler';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
     provideHttpClient(
      withInterceptors([requestInterceptor,errorInterceptor])
    ),
    provideAnimationsAsync(),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton:true
    }),
    importProvidersFrom(NgbModule),
     {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
  ]
};
