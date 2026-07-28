import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  private auth = inject(AuthService);
  private router = inject(Router);
  languageService = inject(LanguageService);

  isLoggedIn = computed(() => this.auth.currentUser() !== null);

  profileRoute = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return null;
    return user.userType === 1 ? '/freelancerProfile' : '/employerProfile';
  });

  goToProfile() {
    const route = this.profileRoute();
    if (route) {
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.auth.logout();
  }

  /** Exposed for the template — no need to inject LanguageService twice elsewhere. */
  currentLang = this.languageService.currentLang;

  toggleLanguage(): void {
    this.languageService.toggle();
  }

  menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.menuOpen()) {
      this.closeMenu();
    }
  }


}