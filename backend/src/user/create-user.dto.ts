export class CreateUserDto {
  name: string;
  email?: string; // теперь опционально
  password: string;
  role?: 'admin' | 'manager' | 'owner';
  managerLevel?: number;
  callCenter?: number;
}