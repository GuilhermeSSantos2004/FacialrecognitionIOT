export interface LoginRequest {
    userName: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    name: string;
    cpf: string;
    token: string;
 }