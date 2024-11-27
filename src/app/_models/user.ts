import { Role } from "./role";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    role: Role | null; // need to replace with actual role with permissions
    token?: string;
    role_id:number;
}
