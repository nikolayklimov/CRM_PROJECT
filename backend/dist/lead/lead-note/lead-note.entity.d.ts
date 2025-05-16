import { Lead } from '../lead.entity';
import { User } from '../../user/user.entity';
export declare class LeadNote {
    id: number;
    lead: Lead;
    manager: User;
    managerLevel: number;
    callCenter: number;
    note: string;
    createdAt: Date;
}
