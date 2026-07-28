import { Component, inject, OnInit, signal } from '@angular/core';
import { EmployerProfileService } from '../services/employer-profile-service';
import { LoginResponse } from '../interfaces/login-response';
import { EmployerProfileArch } from '../interfaces/employer-profile';

@Component({
  selector: 'app-employer-profile',
  imports: [],
  templateUrl: './employer-profile.html',
  styleUrl: './employer-profile.scss',
})
export class EmployerProfile implements OnInit{
   private companyService = inject(EmployerProfileService);

  profile = signal<EmployerProfileArch | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.companyService.getCompanyProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load company profile.');
        this.isLoading.set(false);
      },
    });
  }
}
