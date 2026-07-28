import { EmployerProfileArch } from "./employer-profile";

export interface EmployerResponse {
    success: boolean;
    userType: number;
    user: EmployerProfileArch;
}
