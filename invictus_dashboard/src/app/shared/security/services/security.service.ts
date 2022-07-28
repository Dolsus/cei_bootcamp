import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, take, throwError } from 'rxjs';
import { AppUserAuth } from '../app-user-auth';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private dashboardLoginUrl = 'api/users';
  securityObj: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUserAuth[]> {
    return this.http
      .get<AppUserAuth[]>(this.dashboardLoginUrl)
      .pipe(take(1), catchError(this.handleError));
  }

  handleError(err: HttpErrorResponse) {
    let errMsg = '';
    if (err.error instanceof ErrorEvent) {
      //client-side or network error
      errMsg = `An error occured: ${err.error.message}`;
    } else {
      //backend error
      errMsg = `Server returned code: ${err.status}, with error: ${err.message}`;
    }
    console.log(errMsg);

    return throwError(() => errMsg);
  }

  logout(): void {
    this.clearSecurityObj();
  }

  clearSecurityObj(): void {
    this.securityObj = { ...this.securityObj, ...new AppUserAuth() };
    localStorage.removeItem('bearerToken');
  }
}
