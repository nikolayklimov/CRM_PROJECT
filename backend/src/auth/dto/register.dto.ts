import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsEmail } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(['admin', 'manager', 'owner'])
  role: 'admin' | 'manager' | 'owner';

  @IsOptional()
  @IsInt()
  managerLevel?: number;

  @IsOptional()
  @IsInt()
  callCenter?: number;
}