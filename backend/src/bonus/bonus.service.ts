import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ManagerBonus } from './manager-bonus.entity';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(ManagerBonus)
    private bonusRepository: Repository<ManagerBonus>,
  ) {}

  async getTodayBonusForManager(managerId: number): Promise<number> {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    const bonuses = await this.bonusRepository.find({
    where: {
        manager: { id: managerId },
        created_at: Between(todayStart, todayEnd),
    },
    relations: ['manager'],
    });

    return bonuses.reduce((total, b) => total + b.amount, 0);
  }

  async getBonusesByLead(leadId: number) {
    return this.bonusRepository.find({
        where: { lead: { id: leadId } },
        relations: ['manager', 'lead'],
    });
  }
}