import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';
import { User } from '../user/user.entity';
import { LeadBonusResult } from './types/lead-bonus-result.interface';
import { LeadNote } from './lead-note/lead-note.entity';
import { UpdateLeadDto } from './update-lead.dto';
import { LeadChangeLog } from './lead-change-log.entity';
import { DailyBonusSummary } from '../bonus/daily-bonus-summary.entity';
export declare class LeadService {
    private leadRepository;
    private bonusRepository;
    private ownerBonusRepository;
    private userRepository;
    private leadNoteRepository;
    private leadChangeLogRepository;
    private dailySummaryRepository;
    constructor(leadRepository: Repository<Lead>, bonusRepository: Repository<ManagerBonus>, ownerBonusRepository: Repository<OwnerBonus>, userRepository: Repository<User>, leadNoteRepository: Repository<LeadNote>, leadChangeLogRepository: Repository<LeadChangeLog>, dailySummaryRepository: Repository<DailyBonusSummary>);
    findAll(user?: User): Promise<Lead[]>;
    createLead(dto: CreateLeadDto): Promise<Lead>;
    updateStatus(id: number, status: string, visibleToLevel?: number): Promise<Lead>;
    updateProfit(id: number, profit: number): Promise<Lead>;
    getLeadBonuses(leadId: number): Promise<LeadBonusResult>;
    assignManager(id: number, managerId: number, user: User): Promise<Lead>;
    handleAfterCall(id: number, status: Lead['status'], notes: string, profit: number | undefined, user: {
        id: number;
        role: string;
        managerLevel?: number;
        callCenter?: number;
    }): Promise<Lead>;
    updateLeadFields(id: number, dto: UpdateLeadDto, user: User): Promise<Lead>;
}
