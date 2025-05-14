import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
export declare class AuditLogService {
    private auditRepo;
    constructor(auditRepo: Repository<AuditLog>);
    logAction(userId: number, method: string, route: string, payload: any, actionType?: string, entityId?: string | number, summary?: string): Promise<void>;
    getLogs(params: {
        from?: string;
        to?: string;
        actionType?: string;
    }): Promise<AuditLog[]>;
    exportLogsToCSV(params: {
        from?: string;
        to?: string;
        actionType?: string;
    }): Promise<string>;
}
