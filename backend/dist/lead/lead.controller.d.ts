import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';
export declare class LeadController {
    private readonly leadService;
    private readonly auditService;
    constructor(leadService: LeadService, auditService: AuditLogService);
    getAll(): Promise<Lead[]>;
    create(req: Request & {
        user?: any;
    }, dto: CreateLeadDto): Promise<Lead>;
    importCsv(file: Express.Multer.File): Promise<Lead[]>;
    updateStatus(req: Request & {
        user?: any;
    }, id: number, status: string): Promise<Lead>;
    updateProfit(req: Request & {
        user?: any;
    }, id: number, profit: number): Promise<Lead>;
    assignManager(req: Request & {
        user?: any;
    }, id: number, managerId: number): Promise<Lead>;
    afterCall(req: Request & {
        user?: any;
    }, id: number, body: {
        status: string;
        notes?: string;
        profit?: number;
    }): Promise<Lead>;
    handleAfterCall(req: Request & {
        user?: any;
    }, id: number, body: {
        status: Lead['status'];
        notes: string;
        profit?: number;
    }): Promise<Lead>;
    getBonus(id: number): Promise<any>;
}
