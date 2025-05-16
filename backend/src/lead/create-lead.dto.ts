import { IsNotEmpty, IsOptional, IsString, IsEmail, IsEnum, IsNumber } from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsNotEmpty()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @IsNumber()
  call_center: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  zipcode?: string;

  @IsOptional()
  @IsString()
  ssn?: string;

  @IsOptional()
  @IsString()
  birth_date?: string;

  @IsOptional()
  @IsString()
  telegram?: string;

  @IsOptional()
  @IsEnum(['hot', 'warm', 'cold'])
  priority?: 'hot' | 'warm' | 'cold';

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  source_subid?: string;
}