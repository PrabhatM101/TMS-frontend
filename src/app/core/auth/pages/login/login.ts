import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { HttpService } from '../../../../shared/services/http-service';
import { AuthService } from '../../../../shared/services/auth-service';

type LoginFormGroup = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;

  loginForm: LoginFormGroup = this.fb.group({
    email: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i),
    ]),
    password: this.fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
  });

  get f() {
    return this.loginForm.controls;
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.error('Please fix the highlighted errors.');
      return;
    }

    this.isLoading = true;

    this.http
      .postData('/auth/login', this.loginForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          this.authService.saveAuthData(res);
          this.toastr.success('Login successful!');
          this.router.navigate(['/tasks']);
        },
        error: (err) => {
          this.http.handleErrorToaster(err);
        },
      });
  }
}
