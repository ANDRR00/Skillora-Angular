import { Component } from '@angular/core';
import { Carousel } from "../carousel/carousel";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [Carousel, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
