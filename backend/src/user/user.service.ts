import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { Stage, StageStatus } from '../stage/stage.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Stage)
    private stageRepository: Repository<Stage>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  // 👇 Новый метод для расчёта бонусов по всем лидам
  async getBonusesByUserId(userId: number) {
    const stages = await this.stageRepository.find({
      where: {
        manager: { id: userId },
        status: StageStatus.COMPLETED,
      },
      relations: ['lead'],
    });

    const leadMap = new Map<number, {
      leadId: number;
      amount: number;
      stagesClosed: string[];
      totalPercent: number;
      totalBonus: number;
    }>();

    const stagePercents = {
      stage_1: 6,
      stage_2: 3,
      stage_3: 6,
    };

    for (const stage of stages) {
      const lead = stage.lead;
      if (!lead || !lead.profit) continue;

      if (!leadMap.has(lead.id)) {
        leadMap.set(lead.id, {
          leadId: lead.id,
          amount: lead.profit,
          stagesClosed: [],
          totalPercent: 0,
          totalBonus: 0,
        });
      }

      const entry = leadMap.get(lead.id)!;
      const percent = stagePercents[stage.type] || 0;
      const bonus = (lead.profit * percent) / 100;

      entry.stagesClosed.push(stage.type);
      entry.totalPercent += percent;
      entry.totalBonus += bonus;
    }

    return Array.from(leadMap.values());
  }
}