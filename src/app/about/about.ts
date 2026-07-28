import { Component, inject } from '@angular/core';
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  language = inject(LanguageService)
}
