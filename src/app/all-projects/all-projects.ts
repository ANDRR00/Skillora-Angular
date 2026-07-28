import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoriesService, Category } from '../services/categories-service';
import { map } from 'rxjs';
import { AllProjectService, FullProjectArch } from '../services/all-project-service';
import { TruncatePipe } from '../truncate-pipe';
import { Router } from '@angular/router';
import { Lang, LanguageService } from '../services/language-service';


type CurrencyCode = 'GEL' | 'USD';

interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

/**
 * Shape mirrors what the /projects API endpoint is expected to return.
 * `postedAt` comes back as an ISO string from the backend; `timeAgo` is
 * derived on the client so it stays accurate without refetching.
 *
 * Budgets are always stored in GEL (Georgian Lari) — that's the platform's
 * base currency. Display conversion to other currencies happens client-side
 * via `formatBudget()`.
 */
interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string;
  imageUrl: string;
  postedAt: string; // ISO date string
  tags: string[];
  budgetMin: number; // stored in GEL
  budgetMax: number; // stored in GEL
  categories: string[];
}
@Component({
  selector: 'app-all-projects',
  imports: [TruncatePipe],
  templateUrl: './all-projects.html',
  styleUrl: './all-projects.scss',
})
export class AllProjects {
 private readonly categoriesService = inject(CategoriesService);
  private readonly allProjectService = inject(AllProjectService);
  languageService = inject(LanguageService);
  private readonly router = inject(Router);

   readonly categories = this.categoriesService.categories;

  readonly currencies = computed<CurrencyOption[]>(() => [
      { code: 'GEL', symbol: '₾', label: this.languageService.t('currency_gel') },
      { code: 'USD', symbol: '$', label: this.languageService.t('currency_usd') },
    ]);

  private readonly GEL_TO_USD_RATE = 0.37;

  activeCurrency = signal<CurrencyCode>('GEL');

  selectCurrency(code: CurrencyCode): void {
    this.activeCurrency.set(code);
  }

  viewProject(project: Project): void {
    this.router.navigate(['/project', project.user_id, project.id]);
  }

  activeCategory = signal<string>('all');

  /**
   * Raw fetch — happens exactly once. This is now the ONLY thing that
   * touches the network. Nothing here maps to display shape, and nothing
   * here knows or cares about language.
   */
  private readonly rawProjects = toSignal(
    this.allProjectService.getCompanyProjects(),
    { initialValue: [] as FullProjectArch[] },
  );

  /**
   * Display-shape projects. Reruns automatically whenever `rawProjects()`
   * changes (new data) OR `languageService.currentLang()` changes (toggle
   * flipped) — computed() auto-tracks both. Zero extra network calls.
   */
  readonly projects = computed(() => {
    const lang = this.languageService.currentLang();
    return this.rawProjects().map((post) => this.toProject(post, lang));
  });

  readonly filteredProjects = computed(() => {
    const category = this.activeCategory();
    const all = this.projects();
    return category === 'all'
      ? all
      : all.filter((project) => project.categories.includes(category));
  });

  selectCategory(value: string): void {
    this.activeCategory.set(value);
  }

  trackByProjectId(_index: number, project: Project): string {
    return project.id;
  }

  formatBudget(project: Project): string {
  const currency = this.currencies().find((c) => c.code === this.activeCurrency())!;
  const min = this.convertFromGel(project.budgetMin, currency.code);
  const max = this.convertFromGel(project.budgetMax, currency.code);
  return `${currency.symbol}${min.toLocaleString()} – ${currency.symbol}${max.toLocaleString()}`;
}

  private convertFromGel(amountInGel: number, target: CurrencyCode): number {
    if (target === 'GEL') return amountInGel;
    return Math.round(amountInGel * this.GEL_TO_USD_RATE);
  }

  timeAgo(isoDate: string): string {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  /** Maps a raw API post into the shape the card template consumes, for the given language. */
  private toProject(post: FullProjectArch, lang: Lang): Project {
    const isKa = lang === 'ka';
    return {
      id: String(post.id),
      user_id: String(post.user_id),
      title: isKa ? (post.header_ka || post.header) : post.header,
      description: isKa ? (post.content_ka || post.content) : post.content,
      imageUrl: post.images ? post.images.split(',')[0].trim() : '',
      postedAt: post.created_at,
      tags: post.tags
        ? post.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [],
      budgetMin: post.budget_min,
      budgetMax: post.budget_max,
      categories: post.categories
        ? post.categories.split(',').map(c => c.trim()).filter(Boolean)
        : [],
    };
  }

}
