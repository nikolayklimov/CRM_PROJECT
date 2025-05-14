import { StageType } from '../stage.entity';

export class CreateStageDto {
  type: StageType;
  lead: number;
  manager: number;
  notes?: string;
}