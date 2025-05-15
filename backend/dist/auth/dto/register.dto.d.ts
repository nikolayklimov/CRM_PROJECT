export declare class RegisterDto {
    name: string;
    password: string;
    role: 'admin' | 'manager' | 'owner';
    managerLevel?: number;
}
