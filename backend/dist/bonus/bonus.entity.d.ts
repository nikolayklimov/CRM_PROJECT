import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';
export declare class Bonus {
    id: number;
    manager: User;
    lead: Lead;
    amount: number;
    percent: number;
    created_at: Date;
}
