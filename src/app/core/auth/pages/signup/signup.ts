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

type SignupFormGroup = FormGroup<{
  name: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
private fb = inject(NonNullableFormBuilder);
  private http = inject(HttpService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  isLoading = false;

  signupForm: SignupFormGroup = this.fb.group({
    name: this.fb.control('', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]),
    email: this.fb.control('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i),
    ]),
    password: this.fb.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
  });

  get f() {
    return this.signupForm.controls;
  }

  submit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.toastr.error('Please fix the highlighted errors.');
      return;
    }

    this.isLoading = true;

    this.http
      .postData('/users', this.signupForm.getRawValue())
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Signup successful! Please login.');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.http.handleErrorToaster(err);
        },
      });
  }
}
