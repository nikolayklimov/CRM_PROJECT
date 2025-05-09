import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
export declare class LeadService {
    private leadRepository;
    constructor(leadRepository: Repository<Lead>);
    findAll(): Promise<Lead[]>;
    createLead(dto: CreateLeadDto): Promise<Lead>;
}
