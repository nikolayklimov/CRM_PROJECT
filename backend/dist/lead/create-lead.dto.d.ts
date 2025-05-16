export declare class CreateLeadDto {
    full_name?: string;
    phone?: string;
    call_center: number;
    email?: string;
    country?: string;
    city?: string;
    address?: string;
    zipcode?: string;
    ssn?: string;
    birth_date?: string;
    telegram?: string;
    priority?: 'hot' | 'warm' | 'cold';
    source?: string;
    source_subid?: string;
}
