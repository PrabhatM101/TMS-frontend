import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  if (auth.isLoggedIn()) return true;

  auth.logout();
  return router.createUrlTree(['/auth/login']);
};
