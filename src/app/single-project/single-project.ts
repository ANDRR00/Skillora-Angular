import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AllProjectService, FullProjectArch } from '../services/all-project-service';
import { EmployerProfileService } from '../services/employer-profile-service';
import { EmployerProfileArch } from '../interfaces/employer-profile';
import { LanguageService, Lang } from '../services/language-service';


/**
 * NOTE: `pricingType` and `experienceLevel` are NOT present on FullProjectArch
 * today. They're modeled here because the design calls for them — add
 * `pricing_type` / `experience_level` columns on the backend (or omit these
 * two facts from the summary bar) once you decide whether to support them.
 * Shown as '—' below until then, rather than leaving them blank.
 */
interface ProjectDetail {
  id: string;
  title: string;
  status: string; // e.g. 'Open' | 'In Progress' | 'Closed'
  category: string; // raw comma-joined category values — label resolution TODO, see note below
  postedAt: string; // ISO string
  budgetMin: number;
  budgetMax: number;
  pricingType: string; // NOT in current API — placeholder
  experienceLevel: string; // NOT in current API — placeholder
  coverImageUrl: string | null;
  description: string[]; // paragraphs — split project.content on the way in
  skills: string[];
  // NOT in current API — FullProjectArch only has a single `images` string.
  // Modeled here as a fixed 3-slot gallery to match the mock; swap for a
  // real `gallery: string[]` once/if the backend supports multiple images.
  gallery: { label: string; imageUrl: string | null }[];
}

/**
 * Public-facing view of a company's profile, built from EmployerProfileArch
 * (GET /api/company/:id -> response.user).
 *
 * `verified` is NOT present on EmployerProfileArch — kept as a hardcoded
 * `false` placeholder so the template's "Verified Company" badge never
 * shows until the backend actually adds this field.
 */
interface CompanyPoster {
  id: string;
  name: string;
  verified: boolean; // NOT in current API — placeholder, always false
  description: string;
  website: string;
  phone: string;
  address: string;
  memberSinceYear: string;
  logoUrl: string | null;
}

@Component({
  selector: 'app-single-project',
  imports: [CommonModule, RouterLink],
  templateUrl: './single-project.html',
  styleUrl: './single-project.scss',
})
export class SingleProject {
   private readonly route = inject(ActivatedRoute);
  private readonly allProjectService = inject(AllProjectService);
  private readonly employerProfileService = inject(EmployerProfileService);
  private readonly languageService = inject(LanguageService);
  private readonly userId = this.route.snapshot.paramMap.get('userId')!;
  private readonly projectId = this.route.snapshot.paramMap.get('projectId')!;

  /** Raw fetch — happens once. Language-agnostic. */
  private readonly rawPost = toSignal(
    this.allProjectService.getCompanyProjectsByUser(this.userId).pipe(
      map((posts) => posts.find((p) => String(p.id) === this.projectId) ?? null),
    ),
    { initialValue: null as FullProjectArch | null },
  );

  /** Display-shape detail. Recomputes on new data OR language toggle. */
  readonly project = computed(() => {
    const post = this.rawPost();
    const lang = this.languageService.currentLang();
    return post ? this.toProjectDetail(post, lang) : null;
  });

  readonly poster = toSignal<CompanyPoster | null>(
    this.employerProfileService
      .getCompanyProfileById(Number(this.userId))
      .pipe(map((profile) => this.toCompanyPoster(profile))),
    { initialValue: null },
  );

  formatBudget(project: ProjectDetail): string {
    return `$${project.budgetMin.toLocaleString()} – $${project.budgetMax.toLocaleString()}`;
  }

  relativeTime(isoDate: string): string {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return 'just now';
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  applyForProject(): void {
    // TODO: wire up the real application flow
  }

  private toProjectDetail(post: FullProjectArch, lang: Lang): ProjectDetail {
    const isKa = lang === 'ka';
    const title = isKa ? (post.header_ka || post.header) : post.header;
    const content = isKa ? (post.content_ka || post.content) : post.content;

    const images = post.images
      ? post.images.split(',').map((url) => url.trim()).filter(Boolean)
      : [];

    return {
      id: String(post.id),
      title,
      status: post.status,
      category: post.categories
        ? post.categories.split(',').map((c) => c.trim()).filter(Boolean).join(', ')
        : '',
      postedAt: post.created_at,
      budgetMin: post.budget_min,
      budgetMax: post.budget_max,
      pricingType: '—',
      experienceLevel: '—',
      coverImageUrl: images[0] ?? null,
      description: content ? content.split('\n\n').filter(Boolean) : [],
      skills: post.tags
        ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      gallery: [
        { label: 'Main Preview', imageUrl: images[0] ?? null },
        { label: 'Detail View', imageUrl: images[1] ?? null },
        { label: 'Mobile View', imageUrl: images[2] ?? null },
      ],
    };
  }

  private toCompanyPoster(profile: EmployerProfileArch): CompanyPoster {
    return {
      id: String(profile.id),
      name: profile.company_name ?? '',
      verified: false,
      description: profile.company_description ?? '',
      website: profile.company_website ?? '',
      phone: profile.company_phone ?? '',
      address: profile.company_address ?? '',
      memberSinceYear: profile.created_at
        ? new Date(profile.created_at).getFullYear().toString()
        : '',
      logoUrl: profile.logo_url || null,
    };
  }

}