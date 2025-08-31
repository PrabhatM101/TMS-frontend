import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpService } from './http-service';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpService);
  private router = inject(Router);

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  get token(): string | null {
    return localStorage.getItem('x-auth-token');
  }

  get userId(): string | null {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    return !!this.token && !!this.userId;
  }

  logout(isRedirect:boolean=false) {
    if (this.token) {
      this.http.postData('/auth/logout', {}, {}, { 'x-auth-token': this.token })
        .pipe(
          tap(() => this.clearSession()),
          catchError((err) => {
            console.error('Logout API failed:', err);
            this.clearSession();
            return of(null);
          })
        )
        .subscribe(res=>{this.router.navigate(['/auth/login']);});
    } else {
      this.clearSession();
      if(isRedirect){
         this.router.navigate(['/auth/login']);
      }
    }
  }

  private clearSession() {
    localStorage.clear();
    this.userSubject.next(null);
    // this.router.navigate(['/auth/login']);
  }


  saveAuthData(res: any) {
    localStorage.setItem('x-auth-token', res.token);
    localStorage.setItem('userId', res?._id);
  }

  loadCurrentUser(): Observable<any> {
    if (!this.isLoggedIn()) {
      this.userSubject.next(null);
      return of(null);
    }

    return this.http.getData('/users/' + this.userId).pipe(
      tap((res) => this.userSubject.next(res)),
      catchError((err) => {
        this.logout(true);
        this.userSubject.next(null);
        return of(null);
      })
    );
  }

  get currentUserValue() {
    return this.userSubject.value;
  }
}
