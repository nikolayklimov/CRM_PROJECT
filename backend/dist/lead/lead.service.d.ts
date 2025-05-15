import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';
import { User } from '../user/user.entity';
import { LeadBonusResult } from './types/lead-bonus-result.interface';
export declare class LeadService {
    private leadRepository;
    private bonusRepository;
    private ownerBonusRepository;
    private userRepository;
    constructor(leadRepository: Repository<Lead>, bonusRepository: Repository<ManagerBonus>, ownerBonusRepository: Repository<OwnerBonus>, userRepository: Repository<User>);
    findAll(): Promise<Lead[]>;
    createLead(dto: CreateLeadDto): Promise<Lead>;
    updateStatus(id: number, status: string, visibleToLevel?: number): Promise<Lead>;
    updateProfit(id: number, profit: number): Promise<Lead>;
    getLeadBonuses(leadId: number): Promise<LeadBonusResult>;
    assignManager(id: number, managerId: number): Promise<Lead>;
    handleAfterCall(id: number, status: Lead['status'], notes: string, profit: number | undefined, user: {
        id: number;
        role: string;
    }): Promise<Lead>;
}
