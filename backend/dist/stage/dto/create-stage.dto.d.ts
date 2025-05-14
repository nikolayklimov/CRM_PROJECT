import { StageType } from '../stage.entity';
export declare class CreateStageDto {
    type: StageType;
    lead: number;
    manager: number;
    notes?: string;
}
