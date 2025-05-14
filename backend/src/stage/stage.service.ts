import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stage, StageType, StageStatus } from './stage.entity';
import { CreateStageDto } from './dto/create-stage.dto';

@Injectable()
export class StageService {
  constructor(
    @InjectRepository(Stage)
    private readonly stageRepository: Repository<Stage>,
  ) {}

  async create(dto: CreateStageDto): Promise<Stage> {
    const stage = this.stageRepository.create({
			...dto,
			lead: { id: dto.lead },
			manager: { id: dto.manager },
		});
    return this.stageRepository.save(stage);
  }

	async completeStage(id: number): Promise<Stage> {
		const stage = await this.stageRepository.findOneBy({ id });
		if (!stage) {
			throw new Error(`Stage with id ${id} not found`);
		}

		stage.status = StageStatus.COMPLETED;
		stage.finished_at = new Date();
		stage.duration_seconds = Math.floor(
			(+stage.finished_at - +stage.started_at) / 1000,
		);
		return this.stageRepository.save(stage);
	}

	async findActiveStage(leadId: number, type: StageType): Promise<Stage | null> {
		return this.stageRepository.findOne({
			where: {
				lead: { id: leadId },
				type,
				status: StageStatus.ACTIVE,
			},
			relations: ['lead'],
		});
	}
}