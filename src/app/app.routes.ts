import { Routes } from '@angular/router';
import { Login } from './login/login';
import { RoleSelect } from './role-select/role-select';
import { EmployerRegistration } from './employer-registration/employer-registration';
import { FreelancerRegistration } from './freelancer-registration/freelancer-registration';
import { Home } from './home/home';
import { FreelancerProfile } from './freelancer-profile/freelancer-profile';
import { EmployerProfile } from './employer-profile/employer-profile';
import { About } from './about/about';
import { authGuard } from './auth-guard-guard';
import { AllProjects } from './all-projects/all-projects';
import { AllServices } from './all-services/all-services';
import { SingleProject } from './single-project/single-project';
import { SingleService } from './single-service/single-service';

export const routes: Routes = [
   { path: "", component: Home },
    { path: "login", component: Login },
    { path: "roleSelection", component: RoleSelect },
    { path: "employerRegistration", component: EmployerRegistration },
    { path: "freelancerRegistration", component: FreelancerRegistration },
    { path: "freelancerProfile", component: FreelancerProfile, canActivate: [authGuard] },
    { path: "employerProfile", component: EmployerProfile, canActivate: [authGuard] },
    { path: "about", component: About }, 
    { path: "allProjects", component: AllProjects }, 
    { path: "allServices", component: AllServices }, 
    { path: "project/:userId/:projectId", component: SingleProject }, 
    { path: "service/:userId/:serviceId", component: SingleService }, 
];
