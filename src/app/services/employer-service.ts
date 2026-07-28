import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { EmployerRegistrationRequest } from '../interfaces/employer-registration-request';
import { EmployerRegistrationResponse } from '../interfaces/employer-registration-response';

@Injectable({
  providedIn: 'root',
})
export class EmployerService {
  private readonly registrationApiUrl =
    'https://skillora-api-code.case-scheduler-worker.workers.dev/api/register/company';

  constructor(private http: HttpClient) { }

  registerEmployer(employerData: EmployerRegistrationRequest): Observable<EmployerRegistrationResponse> {
    return this.http.post<EmployerRegistrationResponse>(this.registrationApiUrl, employerData).pipe(
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message || err.error?.error || 'Registration failed. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }
}
