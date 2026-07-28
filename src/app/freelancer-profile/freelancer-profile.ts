import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FreelancerProfileArch } from '../interfaces/freelancer-profile-arch';
import { FreelancerProfileService } from '../services/freelancer-profile-service';
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-freelancer-profile',
  imports: [],
  templateUrl: './freelancer-profile.html',
  styleUrl: './freelancer-profile.scss',
})
export class FreelancerProfile implements OnInit{
 private freelancerService = inject(FreelancerProfileService);
 languageService = inject(LanguageService)

  profile = signal<FreelancerProfileArch | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  age = computed(() => {
    const birthDate = this.profile()?.birth_date;
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  });

  ngOnInit() {
    this.freelancerService.getFreelancerProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        console.log(data)
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load freelancer profile.');
        this.isLoading.set(false);
      },
    });
  }

  downloadResume() {
    const url = this.profile()?.resume_url;
    if (url) {
      window.open(url, '_blank');
    }
  }
}
