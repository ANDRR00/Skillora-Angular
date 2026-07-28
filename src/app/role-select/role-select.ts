import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { LanguageService } from '../services/language-service';

@Component({
  selector: 'app-role-select',
  imports: [RouterLink],
  templateUrl: './role-select.html',
  styleUrl: './role-select.scss',
})
export class RoleSelect {
  language = inject(LanguageService)
}
