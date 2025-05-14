import { Repository } from 'typeorm';
import { ManagerBonus } from './manager-bonus.entity';
export declare class BonusService {
    private bonusRepository;
    constructor(bonusRepository: Repository<ManagerBonus>);
    getTodayBonusForManager(managerId: number): Promise<number>;
    getBonusesByLead(leadId: number): Promise<ManagerBonus[]>;
}
