import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

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
  private document = inject(DOCUMENT);

  readonly translations = signal<Record<string, string>>({});
  readonly currentLang = signal<Lang>(this.stored === 'ka' ? 'ka' : 'en');

  constructor() {
    this.loadTranslations(this.currentLang());

    // Keep <html> class in sync with the language signal, so
    // html.lang-en / html.lang-ka drives --font-body in styles.scss.
    effect(() => {
      const lang = this.currentLang();
      const classList = this.document.documentElement.classList;
      classList.remove('lang-en', 'lang-ka');
      classList.add(`lang-${lang}`);
    });
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