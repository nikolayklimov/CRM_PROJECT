import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { StageStatus } from '../stage/stage.entity';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';
import { User } from '../user/user.entity';
import { ManagerBonusInfo, LeadBonusResult } from './types/lead-bonus-result.interface';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(ManagerBonus)
    private bonusRepository: Repository<ManagerBonus>,
    @InjectRepository(OwnerBonus)
    private ownerBonusRepository: Repository<OwnerBonus>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(): Promise<Lead[]> {
    return this.leadRepository.find();
  }

  async createLead(dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create({ ...dto, status: 'new' });
    return this.leadRepository.save(lead);
  }

  async updateStatus(id: number, status: string, visibleToLevel?: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.status = status as Lead['status'];
    if (visibleToLevel !== undefined) {
      lead.visible_to_level = visibleToLevel;
    }

    return this.leadRepository.save(lead);
  }

  async updateProfit(id: number, profit: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.profit = profit;
    return this.leadRepository.save(lead);
  }

  async getLeadBonuses(leadId: number): Promise<LeadBonusResult> {
    const lead = await this.leadRepository.find({
      where: { id: leadId },
      relations: ['stages', 'stages.manager'],
    }).then((res) => res[0]);

    if (!lead || !lead.profit) {
      throw new Error('Лид не найден или сумма не указана');
    }

    const result: LeadBonusResult = {
      amount: lead.profit,
      managers: [],
      totalManagerBonus: 0,
      ownerModel: '',
      ownerShares: [],
    };

    const stagePercents = {
      stage_1: 6,
      stage_2: 3,
      stage_3: 6,
    };

    const bonusByManager: Record<number, ManagerBonusInfo> = {};

    for (const stage of lead.stages) {
      if (stage.status === StageStatus.COMPLETED && stagePercents[stage.type]) {
        const managerId = stage.manager?.id;
        if (!managerId) continue;

        if (!bonusByManager[managerId]) {
          bonusByManager[managerId] = {
            managerId: managerId.toString(),
            name: `Менеджер #${managerId}`,
            percent: 0,
            sum: 0,
          };
        }

        const percent = stagePercents[stage.type];
        const sum = (lead.profit * percent) / 100;

        bonusByManager[managerId].percent += percent;
        bonusByManager[managerId].sum += sum;
        result.totalManagerBonus += sum;
      }
    }

    result.managers = Object.values(bonusByManager);

    const owners = await this.userRepository.find({ where: { role: 'owner' } });
    const remaining = lead.profit - result.totalManagerBonus;
    const share = Math.floor((remaining / owners.length) * 100) / 100;

    result.ownerModel = owners.length === 3 ? '1/3' : owners.length === 2 ? '1/2' : '100%';
    result.ownerShares = owners.map((owner) => ({
      ownerId: owner.id,
      ownerName: owner.name || `Owner #${owner.id}`,
      amount: share,
    }));

    return result;
  }

  async assignManager(id: number, managerId: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.assigned_to = managerId;

    if (lead.status === 'new') {
      lead.status = 'in_work';
    }

    return this.leadRepository.save(lead);
  }

  async handleAfterCall(
    id: number,
    status: Lead['status'],
    notes: string,
    profit: number | undefined,
    user: { id: number; role: string },
  ): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.status = status;
    lead.notes = notes;

    if (status === 'cut') {
      lead.assigned_to = null;
      lead.visible_to_level = 0;
    }

    if (status === 'to_level2') {
      lead.assigned_to = null;
      lead.visible_to_level = 2;
    }

    if (status === 'to_level3') {
      lead.assigned_to = null;
      lead.visible_to_level = 3;
    }

    if (status === 'closed' && profit != null) {
      lead.profit = profit;
      lead.visible_to_level = 0;

      const leadWithStages = await this.leadRepository.find({
        where: { id },
        relations: ['stages', 'stages.manager'],
      }).then((res) => res[0]);

      const stagePercents = {
        stage_1: 6,
        stage_2: 3,
        stage_3: 6,
      };

      let totalManagerBonus = 0;

      for (const stage of leadWithStages?.stages || []) {
        if (
          stage.status === StageStatus.COMPLETED &&
          stage.manager &&
          stagePercents[stage.type]
        ) {
          const percent = stagePercents[stage.type];
          const bonusAmount = Math.floor(profit * percent * 100) / 100;

          const bonus = this.bonusRepository.create({
            manager: stage.manager,
            lead: lead,
            percent,
            amount: bonusAmount,
          });

          await this.bonusRepository.save(bonus);
          totalManagerBonus += bonusAmount;
        }
      }

      const owners = await this.userRepository.find({ where: { role: 'owner' } });
      const remaining = profit - totalManagerBonus;
      const share = Math.floor((remaining / owners.length) * 100) / 100;

      for (const owner of owners) {
        const ownerBonus = this.ownerBonusRepository.create({
          owner,
          lead,
          amount: share,
        });
        await this.ownerBonusRepository.save(ownerBonus);
      }
    }

    return this.leadRepository.save(lead);
  }
}