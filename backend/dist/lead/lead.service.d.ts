import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { Bonus } from '../bonus/bonus.entity';
export declare class LeadService {
    private leadRepository;
    private bonusRepository;
    constructor(leadRepository: Repository<Lead>, bonusRepository: Repository<Bonus>);
    findAll(): Promise<Lead[]>;
    createLead(dto: CreateLeadDto): Promise<Lead>;
    updateStatus(id: number, status: string): Promise<Lead>;
    updateProfit(id: number, profit: number): Promise<Lead>;
    getLeadBonuses(leadId: number): Promise<any>;
    assignManager(id: number, managerId: number): Promise<Lead>;
    handleAfterCall(id: number, status: Lead['status'], notes: string, profit: number | undefined, user: {
        id: number;
        role: string;
    }): Promise<Lead>;
}
