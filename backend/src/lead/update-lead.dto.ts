import { IsOptional, IsString } from 'class-validator';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  source_subid?: string;
}