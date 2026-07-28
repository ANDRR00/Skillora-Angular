import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { LoginResponse } from '../interfaces/login-response';
import { User } from '../interfaces/user';
import { LoginPayload } from '../interfaces/login-payload';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private loginUrl = 'https://skillora-api-code.case-scheduler-worker.workers.dev/api/login';

  currentUser = signal<User | null>(this.loadUser());

  login(data: LoginPayload): Observable<User> {
    return this.http.post<LoginResponse>(this.loginUrl, data).pipe(
      map(response => response.user),
      tap(user => this.setSession(user))
    );
  }

  // Public entry point for anything that already built a full User object
  // outside of login — e.g. registration flows, after fetching the profile.
  setUser(user: User): void {
    this.setSession(user);
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  private setSession(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  private loadUser(): User | null {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }
}