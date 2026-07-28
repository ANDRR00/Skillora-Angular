import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';

export interface Category {
  label: string;
  value: string;
}

interface CategoriesResponse {
  success: boolean;
  categories: Category[];
}

@Injectable({
  providedIn: 'root',
})

export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'https://skillora-api-code.case-scheduler-worker.workers.dev/api/posts/categories';

  /**
   * Fetches the category filter pills. Falls back to an empty list (rather
   * than throwing) so a failed request doesn't take down the whole page —
   * the component just renders with no category pills instead of crashing.
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<CategoriesResponse>(this.API_URL).pipe(
      map((res) => res.categories),
      catchError((err) => {
        console.error('Failed to load categories', err);
        return of([]);
      }),
    );
  }
}
