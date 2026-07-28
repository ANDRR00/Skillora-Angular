import { UserType } from "./user-type";

export interface UserSession {
    userId: number;
    userType: UserType;
}
