import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AllServicesService, FullServiceArch } from '../services/all-services-service';
import { CategoriesService, Category } from '../services/categories-service';
import { TruncatePipe } from "../truncate-pipe";
import { Router } from '@angular/router';
import { Lang, LanguageService } from '../services/language-service';

type CurrencyCode = 'GEL' | 'USD';

interface CurrencyOption {
  code: CurrencyCode;
  symbol: string;
  label: string;
}

/**
 * Shape mirrors what the /posts/feed/freelancers API endpoint returns.
 * `postedAt` comes back as an ISO-ish string from the backend; `timeAgo`
 * is derived on the client so it stays accurate without refetching.
 *
 * Budgets are always stored in GEL (Georgian Lari) — the platform's base
 * currency. Display conversion to other currencies happens client-side
 * via `formatBudget()`.
 */
interface Service {
  id: string;
  user_id: string;
  title: string;
  description: string;
  imageUrl: string;
  postedAt: string;
  tags: string[];
  budgetMin: number; // stored in GEL
  budgetMax: number; // stored in GEL
  categories: string[];
}




@Component({
  selector: 'app-all-services',
  imports: [TruncatePipe],
  templateUrl: './all-services.html',
  styleUrl: './all-services.scss',
})
export class AllServices {
  private readonly categoriesService = inject(CategoriesService);
  private readonly allServicesService = inject(AllServicesService);
  languageService = inject(LanguageService);
  private readonly router = inject(Router);

   readonly categories = this.categoriesService.categories;

  readonly currencies: CurrencyOption[] = [
    { code: 'GEL', symbol: '₾', label: 'GEL' },
    { code: 'USD', symbol: '$', label: 'USD' },
  ];

  private readonly GEL_TO_USD_RATE = 0.37;

  activeCurrency = signal<CurrencyCode>('GEL');

  selectCurrency(code: CurrencyCode): void {
    this.activeCurrency.set(code);
  }

  activeCategory = signal<string>('all');

  private readonly rawServices = toSignal(
    this.allServicesService.getFreelancerServices(),
    { initialValue: [] as FullServiceArch[] },
  );

  readonly services = computed(() => {
    const lang = this.languageService.currentLang();
    return this.rawServices().map((post) => this.toService(post, lang));
  });

  readonly filteredServices = computed(() => {
    const category = this.activeCategory();
    const all = this.services();
    return category === 'all'
      ? all
      : all.filter((service) => service.categories.includes(category));
  });

  selectCategory(value: string): void {
    this.activeCategory.set(value);
  }

  trackByServiceId(_index: number, service: Service): string {
    return service.id;
  }

  viewService(project: Service): void {
    this.router.navigate(['/service', project.user_id, project.id]);
  }

  formatBudget(service: Service): string {
    const currency = this.currencies.find((c) => c.code === this.activeCurrency())!;
    const min = this.convertFromGel(service.budgetMin, currency.code);
    const max = this.convertFromGel(service.budgetMax, currency.code);
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

  private toService(post: FullServiceArch, lang: Lang): Service {
    const isKa = lang === 'ka';
    return {
      id: String(post.id),
      user_id: String(post.user_id),
      title: isKa ? (post.header_ka || post.header) : post.header,
      description: isKa ? (post.content_ka || post.content) : post.content,
      imageUrl: post.images ? post.images.split(',')[0].trim() : '',
      postedAt: post.created_at,
      tags: post.tags
        ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      budgetMin: post.budget_min,
      budgetMax: post.budget_max,
      categories: post.categories
        ? post.categories.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
    };
  }


}
