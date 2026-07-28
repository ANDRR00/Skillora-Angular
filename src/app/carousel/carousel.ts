import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language-service';

interface Story {
  nameKey: string;
  roleKey: string;
  companyKey: string;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
  projectKey: string;
  skills: string[];
  quoteKey: string;
  resultIcon: string;
  resultKey: string;
}

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss',
})
export class Carousel {
  readonly stories: Story[] = [
    {
      nameKey: 'carousel_story1_name',
      roleKey: 'carousel_story1_role',
      companyKey: 'carousel_story1_company',
      initials: 'NB',
      avatarFrom: '#e8935c',
      avatarTo: '#c96a8a',
      projectKey: 'carousel_story1_project',
      skills: ['React', 'TypeScript', 'Figma', 'REST APIs'],
      quoteKey: 'carousel_story1_quote',
      resultIcon: '🚀',
      resultKey: 'carousel_story1_result',
    },
    {
      nameKey: 'carousel_story2_name',
      roleKey: 'carousel_story2_role',
      companyKey: 'carousel_story2_company',
      initials: 'LK',
      avatarFrom: '#5c9ee8',
      avatarTo: '#8a5cc9',
      projectKey: 'carousel_story2_project',
      skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      quoteKey: 'carousel_story2_quote',
      resultIcon: '⚙️',
      resultKey: 'carousel_story2_result',
    },
    {
      nameKey: 'carousel_story3_name',
      roleKey: 'carousel_story3_role',
      companyKey: 'carousel_story3_company',
      initials: 'MT',
      avatarFrom: '#e8c15c',
      avatarTo: '#e86a6a',
      projectKey: 'carousel_story3_project',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      quoteKey: 'carousel_story3_quote',
      resultIcon: '📱',
      resultKey: 'carousel_story3_result',
    },
    {
      nameKey: 'carousel_story4_name',
      roleKey: 'carousel_story4_role',
      companyKey: 'carousel_story4_company',
      initials: 'GA',
      avatarFrom: '#5ce8a0',
      avatarTo: '#5c9ee8',
      projectKey: 'carousel_story4_project',
      skills: ['Kubernetes', 'Terraform', 'GitHub Actions', 'Monitoring'],
      quoteKey: 'carousel_story4_quote',
      resultIcon: '📈',
      resultKey: 'carousel_story4_result',
    },
  ];

  language = inject(LanguageService);

  index = 0;

  get story() {
    const s = this.stories[this.index];
    return {
      ...s,
      name: this.language.t(s.nameKey),
      role: this.language.t(s.roleKey),
      company: this.language.t(s.companyKey),
      project: this.language.t(s.projectKey),
      quote: this.language.t(s.quoteKey),
      result: this.language.t(s.resultKey),
    };
  }

  get total(): number {
    return this.stories.length;
  }

  goTo(i: number): void {
    this.index = ((i % this.total) + this.total) % this.total;
  }

  prev(): void {
    this.goTo(this.index - 1);
  }

  next(): void {
    this.goTo(this.index + 1);
  }
}