import { User } from '../user/user.entity';
export declare class DailyBonusSummary {
    id: number;
    user: User;
    callCenter: number;
    managerLevel: number | null;
    totalBonus: number;
    date: string;
}
