import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth-service';
import { EmployerProfileArch } from '../interfaces/employer-profile';
import { EmployerResponse } from '../interfaces/employer-response';

@Injectable({
  providedIn: 'root',
})
export class EmployerProfileService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private baseUrl = 'https://skillora-api-code.case-scheduler-worker.workers.dev/api/company';

  getCompanyProfile(): Observable<EmployerProfileArch> {
    const id = this.auth.currentUser()?.id;
    if (!id) {
      throw new Error('No logged-in user id found');
    }
    return this.getCompanyProfileById(id);
  }

  getCompanyProfileById(id: number): Observable<EmployerProfileArch> {
    return this.http.get<EmployerResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.user)
    );
  }
}