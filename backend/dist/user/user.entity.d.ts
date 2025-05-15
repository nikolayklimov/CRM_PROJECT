import { Stage } from '../stage/stage.entity';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'manager' | 'senior' | 'owner' | 'supervisor';
    stages: Stage[];
    bonuses: ManagerBonus[];
    ownerBonuses: OwnerBonus[];
    managerLevel?: number;
}
