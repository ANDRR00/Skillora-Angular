import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { FreelancerRegistrationRequest } from '../interfaces/freelancer-registration-request';
import { FreelancerRegistrationResponse } from '../interfaces/freelancer-registration-response';

@Injectable({
  providedIn: 'root',
})
export class FreelancerService {
  private readonly registrationApiUrl =
    'https://skillora-api-code.case-scheduler-worker.workers.dev/api/register/freelancer/with-resume';

  constructor(private http: HttpClient) { }

  registerFreelancer(
    freelancerData: FreelancerRegistrationRequest,
    resumeFile: File | null
  ): Observable<FreelancerRegistrationResponse> {
    const formData = new FormData();

    Object.entries(freelancerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (resumeFile) {
      formData.append('resume', resumeFile);
    }

    // Do NOT set Content-Type manually — Angular/browser sets the
    // correct multipart boundary automatically for FormData.
    return this.http.post<FreelancerRegistrationResponse>(this.registrationApiUrl, formData).pipe(
      catchError((err: HttpErrorResponse) => {
        const message = err.error?.message || err.error?.error || 'Registration failed. Please try again.';
        return throwError(() => new Error(message));
      })
    );
  }
}
