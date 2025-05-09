export class CreateLeadDto {
  full_name?: string;
  phone?: string;
  email?: string;
  country?: string;
  city?: string;
  address?: string;
  zipcode?: string;
  ssn?: string;
  birth_date?: string; // строкой, потому что дата приходит из JSON/CSV
  telegram?: string;
  priority?: 'hot' | 'warm' | 'cold';
  source?: string;
  source_subid?: string;
  notes?: string;
}