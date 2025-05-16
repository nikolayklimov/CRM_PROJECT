import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';
export declare class OwnerBonus {
    id: number;
    owner: User;
    ownerId: number;
    lead: Lead;
    amount: number;
    created_at: Date;
}
