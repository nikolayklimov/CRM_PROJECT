import { Lead } from '../lead/lead.entity';
import { User } from '../user/user.entity';
export declare enum StageType {
    STAGE_1 = "stage_1",
    STAGE_2 = "stage_2",
    STAGE_3 = "stage_3"
}
export declare enum StageStatus {
    ACTIVE = "active",
    COMPLETED = "completed",
    FAILED = "failed",
    SKIPPED = "skipped"
}
export declare class Stage {
    id: number;
    type: StageType;
    lead: Lead;
    manager: User;
    status: StageStatus;
    started_at: Date;
    finished_at: Date;
    duration_seconds: number;
    notes: string;
}
