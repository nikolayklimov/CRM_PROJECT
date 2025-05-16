import { Repository } from 'typeorm';
import { Stage, StageType } from './stage.entity';
import { CreateStageDto } from './dto/create-stage.dto';
import { Lead } from '../lead/lead.entity';
import { User } from '../user/user.entity';
import { DataSource } from 'typeorm';
export declare class StageService {
    private readonly stageRepository;
    private readonly dataSource;
    constructor(stageRepository: Repository<Stage>, dataSource: DataSource);
    getManager(managerId: number): Promise<User | null>;
    updateLeadStatus(leadId: number, status: Lead['status']): Promise<void>;
    create(dto: CreateStageDto): Promise<Stage>;
    completeStage(id: number): Promise<Stage>;
    findActiveStage(leadId: number, type: StageType): Promise<Stage | null>;
    completeStageByLeadId(leadId: number, user: User): Promise<Stage>;
}
