import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';

export const AuthRoutes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
];
