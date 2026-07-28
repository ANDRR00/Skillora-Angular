import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';
import { LanguageService } from './language-service';

/** Raw shape as returned by the API */
interface CategoryApi {
  label: string;
  label_ka: string;
  value: string;
}

/** Shape consumed by components — already resolved to the active language */
export interface Category {
  label: string;
  value: string;
}

interface CategoriesResponse {
  success: boolean;
  categories: CategoryApi[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient);
  private readonly languageService = inject(LanguageService);
  private readonly API_URL =
    'https://skillora-api-code.case-scheduler-worker.workers.dev/api/posts/categories';

  /**
   * Raw API response, fetched once. Falls back to an empty list (rather
   * than throwing) so a failed request doesn't take down the whole page.
   */
  private readonly rawCategories = toSignal(
    this.http.get<CategoriesResponse>(this.API_URL).pipe(
      map((res) => res.categories),
      catchError((err) => {
        console.error('Failed to load categories', err);
        return of([] as CategoryApi[]);
      }),
    ),
    { initialValue: [] as CategoryApi[] },
  );

  /**
   * Language-resolved categories. Recomputes automatically whenever
   * `LanguageService.currentLang()` changes — no refetch required, since
   * both label variants already arrived in the original response.
   */
  readonly categories = computed<Category[]>(() => {
    const isKa = this.languageService.currentLang() === 'ka';
    return this.rawCategories().map((c) => ({
      value: c.value,
      label: isKa ? (c.label_ka || c.label) : c.label,
    }));
  });
}