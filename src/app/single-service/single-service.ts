import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { AllServicesService, FullServiceArch } from '../services/all-services-service';
import { FreelancerProfileService } from '../services/freelancer-profile-service';
import { FreelancerProfileArch } from '../interfaces/freelancer-profile-arch';
import { LanguageService, Lang } from '../services/language-service';
import { TruncatePipe } from "../truncate-pipe";

/**
 * NOTE: `pricingType` and `experienceLevel` (the "Senior" tier shown in the
 * quick-facts bar) are NOT present on FullServiceArch today — same gap as
 * the project detail page. Add `pricing_type` / `experience_level` on the
 * backend, or drop these two facts from the summary bar. Shown as '—' below
 * until then, rather than leaving them blank.
 */
interface ServiceDetail {
  id: string;
  title: string;
  status: string; // e.g. 'Available' | 'Booked'
  category: string; // raw comma-joined category values — label resolution TODO, see note below
  postedAt: string; // ISO string
  priceMin: number;
  priceMax: number;
  pricingType: string; // NOT in current API — placeholder
  experienceLevel: string; // NOT in current API — placeholder ("Senior" tier)
  coverImageUrl: string | null;
  description: string[]; // paragraphs — split post.content on the way in
  skills: string[];
  // NOT in current API — FullServiceArch only has a single `images` string.
  // Modeled as a fixed 3-slot gallery to match the mock; swap for a real
  // `gallery: string[]` once/if the backend supports multiple images.
  gallery: { label: string; imageUrl: string | null }[];
}

/**
 * Public-facing view of a freelancer's profile. Deliberately excludes
 * personal_id, birth_date, street, postal_code, and email even though
 * FreelancerProfileArch carries them — those never belong on a
 * public-facing service page.
 *
 * `headline`, `yearsExperience`, and `specialty` are still NOT present on
 * the API response, so they're left as '—' placeholders rather than
 * invented, until the backend adds them.
 */
interface FreelancerPoster {
  id: string;
  fullName: string;
  headline: string; // NOT in current API — placeholder
  avatarUrl: string | null;
  description: string; // maps to about_me / about_me_ka
  location: string; // maps to city
  yearsExperience: number;
  specialty: string; // NOT in current API — placeholder
  memberSinceYear: string;
  portfolioUrl: string;
  resumeUrl: string;
}

@Component({
  selector: 'app-single-service',
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './single-service.html',
  styleUrl: './single-service.scss',
})
export class SingleService {
  private readonly route = inject(ActivatedRoute);
  private readonly allServicesService = inject(AllServicesService);
  private readonly freelancerProfileService = inject(FreelancerProfileService);
  languageService = inject(LanguageService);
  private readonly userId = this.route.snapshot.paramMap.get('userId')!;
  private readonly serviceId = this.route.snapshot.paramMap.get('serviceId')!;

  private readonly rawPost = toSignal(
    this.allServicesService.getFreelancerServicesByUser(this.userId).pipe(
      map((posts) => posts.find((p) => String(p.id) === this.serviceId) ?? null),
    ),
    { initialValue: null as FullServiceArch | null },
  );

  readonly service = computed(() => {
    const post = this.rawPost();
    const lang = this.languageService.currentLang();
    return post ? this.toServiceDetail(post, lang) : null;
  });

  private readonly rawProfile = toSignal(
    this.freelancerProfileService
      .getFreelancerProfileById(Number(this.userId))
      .pipe(map((profile) => profile as FreelancerProfileArch | null)),
    { initialValue: null as FreelancerProfileArch | null },
  );

  readonly freelancer = computed(() => {
    const profile = this.rawProfile();
    const lang = this.languageService.currentLang();
    return profile ? this.toFreelancerPoster(profile, lang) : null;
  });

  formatPriceRange(service: ServiceDetail): string {
    return `$${service.priceMin.toLocaleString()} – $${service.priceMax.toLocaleString()}`;
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

  hireFreelancer(): void {
    // TODO: wire up the real hire/contact flow
  }

  private toServiceDetail(post: FullServiceArch, lang: Lang): ServiceDetail {
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
      priceMin: post.budget_min,
      priceMax: post.budget_max,
      pricingType: '—',
      experienceLevel: '—',
      coverImageUrl: images[0] ?? null,
      description: content ? content.split('\n\n').filter(Boolean) : [],
      skills: post.tags
        ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
      gallery: [
        { label: 'Featured Work', imageUrl: images[0] ?? null },
        { label: 'Brand Identity', imageUrl: images[1] ?? null },
        { label: 'Design System', imageUrl: images[2] ?? null },
      ],
    };
  }

  private toFreelancerPoster(profile: FreelancerProfileArch, lang: Lang): FreelancerPoster {
    const isKa = lang === 'ka';
    const description = isKa ? (profile.about_me_ka || profile.about_me) : profile.about_me;

    return {
      id: String(profile.id),
      fullName: `${profile.first_name} ${profile.last_name}`.trim(),
      headline: '—',
      avatarUrl: profile.profile_pic_url || null,
      description: description ?? '',
      location: profile.city ?? '',
      yearsExperience: profile.experience,
      specialty: '—',
      memberSinceYear: profile.created_at
        ? new Date(profile.created_at).getFullYear().toString()
        : '',
      portfolioUrl: profile.portfolio ?? '',
      resumeUrl: profile.resume_url ?? '',
    };
  }

}