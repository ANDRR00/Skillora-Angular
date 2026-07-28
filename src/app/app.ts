import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./login/login";
import { RoleSelect } from "./role-select/role-select";
import { EmployerRegistration } from "./employer-registration/employer-registration";
import { FreelancerRegistration } from "./freelancer-registration/freelancer-registration";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { EmployerProfile } from "./employer-profile/employer-profile";
import { FreelancerProfile } from "./freelancer-profile/freelancer-profile";
import { About } from "./about/about";
import { SingleProject } from "./single-project/single-project";
import { AllServices } from "./all-services/all-services";
import { SingleService } from './single-service/single-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Login, RoleSelect, EmployerRegistration, FreelancerRegistration, Header, Footer, EmployerProfile, FreelancerProfile, About, SingleProject, AllServices, SingleService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Skillora');
}
