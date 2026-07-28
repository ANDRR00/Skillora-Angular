import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

export type Lang = 'en' | 'ka';

const STORAGE_KEY = 'skillora-lang';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  // Guarded for SSR safety — localStorage doesn't exist during server render.
  private readonly stored: Lang | null =
    typeof localStorage !== 'undefined'
      ? (localStorage.getItem(STORAGE_KEY) as Lang | null)
      : null;

  private http = inject(HttpClient);
  readonly translations = signal<Record<string, string>>({});

  readonly currentLang = signal<Lang>(this.stored === 'ka' ? 'ka' : 'en');

  constructor() {
    this.loadTranslations(this.currentLang());
  }

  t(key: string): string {
    return this.translations()[key] ?? key;
  }

  toggle(): void {
    this.setLang(this.currentLang() === 'en' ? 'ka' : 'en');
  }

  setLang(lang: Lang): void {

    this.currentLang.set(lang);

    this.loadTranslations(lang);

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }

  }

  private loadTranslations(lang: Lang): void {
    this.http
      .get<Record<string, string>>(`/translations/${lang}.json`)
      .subscribe(data => {
        this.translations.set(data);
      });
  }
}