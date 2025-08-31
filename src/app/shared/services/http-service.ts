import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, throwError } from 'rxjs';
import { BadInput } from '../error/bad-input';
import { NotFoundError } from '../error/not-found-error';
import { UnAuthorisedError } from '../error/unAuthorised-error';
import { AppError } from '../error/app-error';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  getData(url: string, queryParams: any = {}, headers: any = {}) {
    return this.http
      .get(this.baseUrl + url, { params: queryParams, headers })
      .pipe(
        map((response: any) => response?.data || response),
        catchError((error) => this.handleError(error))
      );
  }

  postData(url: string, payload: any, queryParams: any = {}, headers: any = {}) {
    return this.http
      .post(this.baseUrl + url, payload, {
        params: queryParams,
        headers: new HttpHeaders(headers),
      })
      .pipe(
        map((response: any) => response?.data || response),
        catchError((error) => this.handleError(error))
      );
  }

  putData(url: string, payload: any) {
    return this.http.put(this.baseUrl + url, payload).pipe(
      map((response: any) => response?.data || response),
      catchError((error) => this.handleError(error))
    );
  }

  patchData(url: string, payload: any, queryParams: any = {}, headers: any = {}) {
    return this.http
      .patch(this.baseUrl + url, payload, {
        params: queryParams,
        headers: new HttpHeaders(headers),
      })
      .pipe(
        map((response: any) => response?.data || response),
        catchError((error) => this.handleError(error))
      );
  }

  deleteData(url: string, data: any = {}) {
    return this.http.delete(this.baseUrl + url, { body: data }).pipe(
      map((response: any) => response?.data || response),
      catchError((error) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 400) return throwError(() => new BadInput(error));
    if (error.status === 404) return throwError(() => new NotFoundError(error));
    if (error.status === 403) return throwError(() => new UnAuthorisedError(error));
    if (error.status === 401) return throwError(() => new UnAuthorisedError(error));
    if (error.status === 0) return throwError(() => new AppError(error));
    return throwError(() => new AppError(error));

  }

  public handleErrorToaster(error: any, showToaster: boolean = true) {
    console.error('API Error:', error);

    if (
      error instanceof UnAuthorisedError ||
      error instanceof BadInput ||
      error instanceof NotFoundError
    ) {
      if (showToaster) {
        this.toastr.error(
          error?.originalError?.error?.message || 'Something went wrong!'
        );
      }
    } else {
      if (showToaster) this.toastr.error('Unexpected error occurred.');
    }
  }
}
