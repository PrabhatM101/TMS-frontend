import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('x-auth-token');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    return true;
  }

  return router.createUrlTree(['/tasks']);
};
