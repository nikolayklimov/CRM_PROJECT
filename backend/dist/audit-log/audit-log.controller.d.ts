import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private readonly auditService;
    constructor(auditService: AuditLogService);
    getLogs(from?: string, to?: string, actionType?: string): Promise<import("./audit-log.entity").AuditLog[]>;
    exportLogs(from?: string, to?: string, actionType?: string): Promise<string>;
}
