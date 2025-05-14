import { Repository } from 'typeorm';
import { Stage, StageType } from './stage.entity';
import { CreateStageDto } from './dto/create-stage.dto';
export declare class StageService {
    private readonly stageRepository;
    constructor(stageRepository: Repository<Stage>);
    create(dto: CreateStageDto): Promise<Stage>;
    completeStage(id: number): Promise<Stage>;
    findActiveStage(leadId: number, type: StageType): Promise<Stage | null>;
}
