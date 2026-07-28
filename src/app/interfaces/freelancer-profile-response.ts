import { FreelancerProfileArch } from "./freelancer-profile-arch";

export interface FreelancerProfileResponse {
    success: boolean;
    userType: number;
    user: FreelancerProfileArch;
}