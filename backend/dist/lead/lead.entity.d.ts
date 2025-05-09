export declare class Lead {
    id: number;
    full_name: string;
    phone: string;
    email: string;
    country: string;
    city: string;
    address: string;
    zipcode: string;
    ssn: string;
    birth_date: Date;
    lead_date: Date;
    telegram: string;
    priority: 'hot' | 'warm' | 'cold';
    source: string;
    source_subid: string;
    notes: string;
}
