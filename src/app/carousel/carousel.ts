import { Component } from '@angular/core';

interface Story {
  name: string;
  role: string;
  company: string;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
  project: string;
  skills: string[];
  quote: string;
  resultIcon: string;
  result: string;
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
      name: 'Nino Beridze',
      role: 'Frontend Developer',
      company: 'TechFlow Georgia',
      initials: 'NB',
      avatarFrom: '#e8935c',
      avatarTo: '#c96a8a',
      project: 'E-commerce Platform Redesign',
      skills: ['React', 'TypeScript', 'Figma', 'REST APIs'],
      quote:
        "Through Skillora, Nino partnered with TechFlow to rebuild their entire customer-facing product. The transparent milestone system let both parties align on expectations from day one.",
      resultIcon: '🚀',
      result: 'Platform launched 2 weeks ahead of schedule. 40% improvement in conversion rate.',
    },
    {
      name: 'Levan Kapanadze',
      role: 'Backend Engineer',
      company: 'Datalink Systems',
      initials: 'LK',
      avatarFrom: '#5c9ee8',
      avatarTo: '#8a5cc9',
      project: 'Payments Infrastructure Overhaul',
      skills: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
      quote:
        "Levan worked directly with Datalink's founders to modernize a decade-old billing system. Weekly check-ins built through Skillora kept the migration transparent and low-risk.",
      resultIcon: '⚙️',
      result: 'Zero downtime migration. Transaction processing 3x faster post-launch.',
    },
    {
      name: 'Mariam Tsereteli',
      role: 'Product Designer',
      company: 'Orbit Studio',
      initials: 'MT',
      avatarFrom: '#e8c15c',
      avatarTo: '#e86a6a',
      project: 'Mobile Banking App Redesign',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      quote:
        "Mariam led a full design overhaul for Orbit's flagship banking app, running usability sessions alongside the in-house team through Skillora's shared workspace.",
      resultIcon: '📱',
      result: 'App Store rating rose from 3.2 to 4.7 within one quarter.',
    },
    {
      name: 'Giorgi Abashidze',
      role: 'DevOps Consultant',
      company: 'Cloudera Georgia',
      initials: 'GA',
      avatarFrom: '#5ce8a0',
      avatarTo: '#5c9ee8',
      project: 'CI/CD Pipeline Modernization',
      skills: ['Kubernetes', 'Terraform', 'GitHub Actions', 'Monitoring'],
      quote:
        "Giorgi partnered with Cloudera's engineering team to rebuild their deployment pipeline from the ground up, with every milestone tracked openly through Skillora.",
      resultIcon: '📈',
      result: 'Deployment time cut from 45 minutes to under 4. Incidents down 60%.',
    },
  ];
 
  index = 0;
 
  get story(): Story {
    return this.stories[this.index];
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

