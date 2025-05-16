import { StageService } from '../stage/stage.service';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class CallController {
    private readonly stageService;
    private readonly auditService;
    constructor(stageService: StageService, auditService: AuditLogService);
    startCall(req: any, body: {
        leadId: number;
    }): Promise<import("../stage/stage.entity").Stage>;
    endCall(req: any, body: {
        leadId: number;
    }): Promise<import("../stage/stage.entity").Stage>;
}
