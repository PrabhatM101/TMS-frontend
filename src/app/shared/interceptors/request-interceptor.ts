import { HttpInterceptorFn } from '@angular/common/http';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('x-auth-token');
  if (token) {
    const clonedReq = req.clone({
      setHeaders: { 'x-auth-token': token },
    });
    return next(clonedReq);
  }
  return next(req);
};
