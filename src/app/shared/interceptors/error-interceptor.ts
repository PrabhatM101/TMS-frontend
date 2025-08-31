import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const modal = inject(NgbModal);

  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 || err.status === 403) {
          if (err.error?.data?.isLogoutRequired) {
            localStorage.clear();
            modal.dismissAll();
            toastr.error(err.error?.message || 'Session expired. Please login again.');
            router.navigate(['/auth/login']);
          }
        }
      }
      throw err;
    })
  );
};
