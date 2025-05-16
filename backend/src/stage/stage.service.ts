import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stage, StageType, StageStatus } from './stage.entity';
import { CreateStageDto } from './dto/create-stage.dto';
import { Lead } from '../lead/lead.entity';
import { User } from '../user/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class StageService {
	constructor(
		@InjectRepository(Stage)
		private readonly stageRepository: Repository<Stage>,
		private readonly dataSource: DataSource,
	) {}

	async getManager(managerId: number): Promise<User | null> {
		return this.dataSource.getRepository(User).findOneBy({ id: managerId });
	}

	async updateLeadStatus(leadId: number, status: Lead['status']): Promise<void> {
		await this.dataSource.getRepository(Lead).update({ id: leadId }, { status });
}

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

	async completeStageByLeadId(leadId: number, user: User): Promise<Stage> {
		const stage = await this.stageRepository.findOne({
			where: {
				lead: { id: leadId },
				manager: { id: user.id },
				status: StageStatus.ACTIVE,
			},
			relations: ['lead', 'manager'],
		});

		if (!stage) {
			throw new ForbiddenException(`Нет доступа к лидам или активная стадия не найдена`);
		}

		const lead = stage.lead;

		const canAccess =
			user.role === 'admin' || user.role === 'owner' ||
			(user.role === 'manager' &&
				lead.visible_to_level === user.managerLevel &&
				lead.assigned_to === user.id &&
				lead.status !== 'closed');

		if (!canAccess) {
			throw new ForbiddenException('Нет доступа к этому лиду');
		}

		stage.status = StageStatus.COMPLETED;
		stage.finished_at = new Date();
		stage.duration_seconds = Math.floor(
			(+stage.finished_at - +stage.started_at) / 1000,
		);

		return this.stageRepository.save(stage);
	}
}