import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: 'admin' | 'manager' | 'owner';  // Убедитесь, что тип здесь правильный
}