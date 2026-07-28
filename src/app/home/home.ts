import { Component, inject } from '@angular/core';
import { Carousel } from "../carousel/carousel";
import { RouterLink } from "@angular/router";
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-home',
  imports: [Carousel, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  language = inject(LanguageService)
}
