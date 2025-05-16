import { Lead } from './lead.entity';
import { User } from '../user/user.entity';
export declare class LeadChangeLog {
    id: number;
    lead: Lead;
    manager: User;
    field: string;
    oldValue: string;
    newValue: string;
    createdAt: Date;
}
