import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

/**
 * Shape returned by GET /api/posts/feed/freelancers.
 * Same structure as FullProjectArch — freelancers post "services"
 * the same way companies post "projects".
 */
export interface FullServiceArch {
  id: number;
  user_id: number;
  user_type: number;
  header: string;
  header_ka: string;
  content: string;
  content_ka: string;
  images: string | null;
  tags: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  categories: string | null;
  budget_min: number;
  budget_max: number;
}

interface FreelancerFeedResponse {
  success: boolean;
  type: string;
  posts: FullServiceArch[];
}

@Injectable({
  providedIn: 'root',
})
export class AllServicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl =
    'https://skillora-api-code.case-scheduler-worker.workers.dev/api/posts/feed/freelancers';
  private readonly freelancerServicesByUserUrl = (userId: string): string =>
    `https://skillora-api-code.case-scheduler-worker.workers.dev/api/posts/freelancer/${userId}`;

  getFreelancerServices(): Observable<FullServiceArch[]> {
    return this.http
      .get<FreelancerFeedResponse>(this.baseUrl)
      .pipe(map((res) => res.posts));
  }

  /**
   * Fetches only the posts belonging to one freelancer (by user_id). Used
   * by the single-service detail page, which then filters the result for
   * the one post whose id matches the route param — see the TODO in
   * SingleService about swapping this for a direct GET /api/posts/:id
   * fetch if/when that endpoint exists.
   */
  getFreelancerServicesByUser(userId: string): Observable<FullServiceArch[]> {
    return this.http
      .get<FreelancerFeedResponse>(this.freelancerServicesByUserUrl(userId))
      .pipe(map((res) => res.posts));
  }
}