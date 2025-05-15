import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: 'admin' | 'manager' | 'owner';

  @IsOptional()
  @IsInt()
  managerLevel?: number;
}