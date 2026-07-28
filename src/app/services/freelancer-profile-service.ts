import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { FreelancerProfileArch } from '../interfaces/freelancer-profile-arch';
import { AuthService } from './auth-service';
import { FreelancerProfileResponse } from '../interfaces/freelancer-profile-response';

@Injectable({
  providedIn: 'root',
})
export class FreelancerProfileService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private baseUrl = 'https://skillora-api-code.case-scheduler-worker.workers.dev/api/freelancer';

  getFreelancerProfile(): Observable<FreelancerProfileArch> {
    const id = this.auth.currentUser()?.id;
    if (!id) {
      throw new Error('No logged-in user id found');
    }
    return this.getFreelancerProfileById(id);
  }

  getFreelancerProfileById(id: number): Observable<FreelancerProfileArch> {
    return this.http.get<FreelancerProfileResponse>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.user)
    );
  }
}