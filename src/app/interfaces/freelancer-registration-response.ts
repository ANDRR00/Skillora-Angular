export interface FreelancerRegistrationResponse {
    success: boolean;
    message: string;
    userId: number;
    userType: number;
    resumeUrl?: string;
}
