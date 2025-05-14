import { StageService } from './stage.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { Stage } from './stage.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';
export declare class StageController {
    private readonly stageService;
    private readonly auditService;
    constructor(stageService: StageService, auditService: AuditLogService);
    create(req: Request, dto: CreateStageDto): Promise<Stage>;
    complete(req: Request, id: string): Promise<Stage>;
    getActiveStage(leadId: number): Promise<Stage | null>;
}
