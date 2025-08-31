import { Routes } from '@angular/router';
import { authGuard } from './core/tasks/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';
import { NotFound } from './core/pages/not-found/not-found';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./core/auth/auth.routes').then((m) => m.AuthRoutes),
    canActivate: [guestGuard],
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadChildren: () => import('./core/tasks-layout/tasks.route').then((m) => m.TASKS_ROUTES),
  }, {
    path: '',
    pathMatch: 'full',
    redirectTo: checkRootRedirect()
  },
  { path: '**', component: NotFound },
];


function checkRootRedirect(): string {
  const token = localStorage.getItem('x-auth-token');
  const userId = localStorage.getItem('userId');
  return token && userId ? 'tasks' : 'auth/login';
}
