import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
import { EmployerRegistrationRequest } from '../interfaces/employer-registration-request';
import { EmployerService } from '../services/employer-service';
import { AuthService } from '../services/auth-service';
import { EmployerProfileService } from '../services/employer-profile-service';
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-employer-registration',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './employer-registration.html',
  styleUrl: './employer-registration.scss',
})
export class EmployerRegistration {

  employerForm: FormGroup;
  isSubmitting = false;
  originalBtnText = 'Create Account';

  constructor(
    private fb: FormBuilder,
    private employerService: EmployerService,
    private employerProfileService: EmployerProfileService,
    private authService: AuthService,
    private router: Router
  ) {
    this.employerForm = this.fb.group({
      companyName: ['', Validators.required],
      companyOrigin: ['', Validators.required],
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
      companyAddress: ['', Validators.required],
      companyDescription: [''],
      companyWebsite: [''],
      companyPhone: ['', [
        Validators.required,
        Validators.maxLength(9)
      ]],
      terms: [false, Validators.requiredTrue]
    });
  }

  language = inject(LanguageService)
  
  get passwordValue(): string {
    return this.employerForm.get('password')?.value || '';
  }

  get passwordTouched(): boolean {
    const control = this.employerForm.get('password');
    return !!(control && (control.dirty || control.touched));
  }

  get passwordChecks() {
    const value = this.passwordValue;
    return [
      { label: 'At least 12 characters', valid: value.length >= 12 },
      { label: 'One uppercase letter', valid: /[A-Z]/.test(value) },
      { label: 'One number', valid: /\d/.test(value) },
      { label: 'One special character', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) },
    ];
  }

  private showAlert(title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info'): void {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor: '#b8863b'
    });
  }

  onSubmit(): void {
    if (this.employerForm.invalid) {
      this.employerForm.markAllAsTouched();
      return;
    }

    const { password, repeatPassword } = this.employerForm.value;

    if (password !== repeatPassword) {
      this.showAlert('Password Mismatch', 'Passwords do not match. Please try again.', 'error');
      return;
    }

    this.isSubmitting = true;

    const employerData: EmployerRegistrationRequest = {
      companyName: this.employerForm.value.companyName.trim(),
      companyOrigin: this.employerForm.value.companyOrigin.trim(),
      email: this.employerForm.value.email.trim(),
      password: password,
      companyAddress: this.employerForm.value.companyAddress.trim(),
      companyDescription: this.employerForm.value.companyDescription.trim(),
      companyWebsite: (this.employerForm.value.companyWebsite || '').trim(),
      companyPhone: this.employerForm.value.companyPhone.trim(),
    };

    this.employerService.registerEmployer(employerData).subscribe({
      next: (result) => {
        this.employerProfileService.getCompanyProfileById(result.userId).subscribe({
          next: (profile) => {
            this.authService.setUser({
              id: profile.id,
              email: profile.email,
              name: profile.company_name,
              posts: [],
              status_mode: 0,
              userType: result.userType,
            });
            this.showAlert('Success!', 'Company account created successfully.', 'success');
            this.employerForm.reset();
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