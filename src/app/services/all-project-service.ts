import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';

export interface FullProjectArch {
  id: number;
  user_id: number;
  user_type: number;
  header: string;
  header_ka: string;
  content: string;
  content_ka: string;
  images: string;
  tags: string;
  status: string;
  created_at: string;
  updated_at: string;
  categories: string;
  budget_min: number;
  budget_max: number;
}

/**
 * TODO: confirm the exact envelope shape against the live response.
 * Modeled after /api/categories, which wraps its array as { success, categories }.
 * Adjust the `posts` key here (and the `map` below) if either endpoint
 * wraps the array under a different property name.
 */
interface CompanyProjectsResponse {
  success: boolean;
  posts: FullProjectArch[];
}

@Injectable({
  providedIn: 'root',
})
export class AllProjectService {
  private readonly http = inject(HttpClient);
  private readonly allProjectsUrl: string =
    'https://skillora-api-code.case-scheduler-worker.workers.dev/api/posts/feed/companies';
  private readonly companyProjectsByUserUrl = (userId: string): string =>
    `https://skillora-api-code.case-scheduler-worker.workers.dev/api/posts/company/${userId}`;

  /**
   * Fetches all company-posted projects across the whole marketplace, for
   * the public browse/feed page (AllProjects). Falls back to an empty array
   * (rather than throwing) so a failed request doesn't take down the page —
   * the grid just renders empty/@empty instead.
   */
  getCompanyProjects(): Observable<FullProjectArch[]> {
    return this.http.get<CompanyProjectsResponse>(this.allProjectsUrl).pipe(
      map((res) => res.posts),
      catchError((err) => {
        console.error('Failed to load company projects', err);
        return of([]);
      }),
    );
  }

  /**
   * Fetches only the posts belonging to one company (by user_id). Used by
   * the single-project detail page, which then filters the result for the
   * one post whose id matches the route param — see the TODO in
   * SingleProject about swapping this for a direct GET /api/posts/:id
   * fetch if/when that endpoint exists.
   */
  getCompanyProjectsByUser(userId: string): Observable<FullProjectArch[]> {
    return this.http.get<CompanyProjectsResponse>(this.companyProjectsByUserUrl(userId)).pipe(
      map((res) => res.posts),
      catchError((err) => {
        console.error('Failed to load company projects for user', userId, err);
        return of([]);
      }),
    );
  }
}