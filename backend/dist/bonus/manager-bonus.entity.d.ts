import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';
export declare class ManagerBonus {
    id: number;
    manager: User;
    lead: Lead;
    percent: number;
    amount: number;
    created_at: Date;
}
