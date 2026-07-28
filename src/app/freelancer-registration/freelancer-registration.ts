import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FreelancerRegistrationRequest } from '../interfaces/freelancer-registration-request';
import Swal from 'sweetalert2';
import { FreelancerService } from '../services/freelancer-service';
import { AuthService } from '../services/auth-service';
import { FreelancerProfileService } from '../services/freelancer-profile-service';
import { LanguageService } from '../services/language-service';

const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_RESUME_SIZE_MB = 5;

@Component({
  selector: 'app-freelancer-registration',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './freelancer-registration.html',
  styleUrl: './freelancer-registration.scss',
})
export class FreelancerRegistration {

  freelancerForm: FormGroup;
  isSubmitting = false;
  originalBtnText = 'Create Account';
  selectedResumeFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private freelancerService: FreelancerService,
    private freelancerProfileService: FreelancerProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.freelancerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)
      ]],
      repeatPassword: ['', Validators.required],
      city: ['', [Validators.required, Validators.minLength(3)]],
      street: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(4)]],
      personalId: ['', Validators.required],
      birthDate: ['', Validators.required],
      aboutMe: [''],
      portfolio: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

  language = inject(LanguageService)

  private showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#b8863b'
    });
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedResumeFile = input.files?.[0] || null;
  }

  onSubmit(): void {
    if (this.freelancerForm.invalid) {
      this.freelancerForm.markAllAsTouched();
      return;
    }

    const { password, repeatPassword } = this.freelancerForm.value;

    if (password !== repeatPassword) {
      this.showAlert('Password Mismatch', 'Passwords do not match. Please try again.', 'error');
      return;
    }

    if (this.selectedResumeFile) {
      if (!ALLOWED_RESUME_TYPES.includes(this.selectedResumeFile.type)) {
        this.showAlert('Invalid File Type', 'Please upload your resume as a PDF or Word document.', 'error');
        return;
      }
      if (this.selectedResumeFile.size > MAX_RESUME_SIZE_MB * 1024 * 1024) {
        this.showAlert('File Too Large', `Resume must be smaller than ${MAX_RESUME_SIZE_MB}MB.`, 'error');
        return;
      }
    }

    this.isSubmitting = true;

    const freelancerData: FreelancerRegistrationRequest = {
      firstName: this.freelancerForm.value.firstName.trim(),
      lastName: this.freelancerForm.value.lastName.trim(),
      email: this.freelancerForm.value.email.trim(),
      password: password,
      city: this.freelancerForm.value.city.trim(),
      street: this.freelancerForm.value.street.trim(),
      postalCode: this.freelancerForm.value.postalCode.trim(),
      personalId: this.freelancerForm.value.personalId.trim(),
      birthDate: this.freelancerForm.value.birthDate,
      aboutMe: (this.freelancerForm.value.aboutMe || '').trim(),
      portfolio: (this.freelancerForm.value.portfolio || '').trim(),
    };

    this.freelancerService.registerFreelancer(freelancerData, this.selectedResumeFile).subscribe({
      next: (result) => {
        this.freelancerProfileService.getFreelancerProfileById(result.userId).subscribe({
          next: (profile) => {
            this.authService.setUser({
              id: profile.id,
              email: profile.email,
              name: `${profile.first_name} ${profile.last_name}`,
              posts: [],
              status_mode: 0,
              userType: result.userType,
            });
            this.showAlert('Success!', 'Freelancer account created successfully.', 'success');
            this.freelancerForm.reset();
            this.selectedResumeFile = null;
            this.isSubmitting = false;
            this.router.navigate(['']);
          },
          error: (error) => {
            console.error('Profile fetch after registration failed:', error);
            this.showAlert('Almost there', 'Account created — please log in.', 'info');
            this.isSubmitting = false;
            this.router.navigate(['/login']);
          }
        });
      },
      error: (error) => {
        console.error('Registration Error:', error);
        this.showAlert('Registration Failed', error.message || 'Something went wrong. Please try again.', 'error');
        this.isSubmitting = false;
      }
    });
  }

}