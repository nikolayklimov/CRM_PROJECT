import { Stage } from '../stage/stage.entity';
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
    stages: Stage[];
    status: 'new' | 'in_work' | 'callback' | 'cut' | 'to_level2' | 'to_level3' | 'closed';
    assigned_to: number | null;
    visible_to_level: number;
    profit: number;
}
