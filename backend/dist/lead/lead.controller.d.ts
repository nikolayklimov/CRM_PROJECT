import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
export declare class LeadController {
    private readonly leadService;
    constructor(leadService: LeadService);
    getAll(): Promise<Lead[]>;
    create(dto: CreateLeadDto): Promise<Lead>;
}
