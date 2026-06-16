export interface User {
    id: number;
    name: string;
    email: string;
    created_at: Date;
}

export interface CreateUserDTO {
    name: string;
    email: string;
}

export interface UpdateUserDTO {
    name?: string;
    email?: string;
}