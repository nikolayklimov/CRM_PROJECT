export declare class CreateUserDto {
    name: string;
    email?: string;
    password: string;
    role?: 'admin' | 'manager' | 'owner';
    managerLevel?: number;
    callCenter?: number;
}
