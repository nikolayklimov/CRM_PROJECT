import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';
import { LeadBonusResult } from './types/lead-bonus-result.interface';
import { User } from '../user/user.entity';
import { UpdateLeadDto } from './update-lead.dto';
export declare class LeadController {
    private readonly leadService;
    private readonly auditService;
    constructor(leadService: LeadService, auditService: AuditLogService);
    getAll(req: Request & {
        user?: User;
    }): Promise<Lead[]>;
    create(req: Request & {
        user?: any;
    }, dto: CreateLeadDto): Promise<Lead>;
    importCsv(file: Express.Multer.File): Promise<Lead[]>;
    updateStatus(req: Request & {
        user?: any;
    }, id: number, status: string, visibleToLevel?: number): Promise<Lead>;
    updateProfit(req: Request & {
        user?: any;
    }, id: number, profit: number): Promise<Lead>;
    assignManager(req: Request & {
        user?: any;
    }, id: number): Promise<Lead>;
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
        note?: string;
        profit?: number;
    }): Promise<Lead>;
    updateLeadFields(id: number, dto: UpdateLeadDto, req: Request): Promise<Lead>;
    getBonus(id: number): Promise<LeadBonusResult>;
}
