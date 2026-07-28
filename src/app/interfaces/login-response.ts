import { User } from "./user";

export interface LoginResponse {
    success: boolean;
    user: User;
}
