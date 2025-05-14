import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { Stage, StageType, StageStatus } from '../stage/stage.entity';
import { Bonus } from '../bonus/bonus.entity';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
      @InjectRepository(Bonus)
    private bonusRepository: Repository<Bonus>,
  ) {}

  // Получение всех лидов (в будущем можно фильтровать по доступу)
  findAll(): Promise<Lead[]> {
    return this.leadRepository.find();
  }

  // Создание нового лида
  async createLead(dto: CreateLeadDto): Promise<Lead> {
    const lead = this.leadRepository.create({
      ...dto,
      status: 'new', // статус по умолчанию
    });
    return this.leadRepository.save(lead);
  }

  // Обновление статуса клиента (например: в_работе, перезвонить, срез, передан_на_2_звено и т.д.)
  async updateStatus(id: number, status: string): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.status = status as Lead['status'];
    return this.leadRepository.save(lead);
  }

  async updateProfit(id: number, profit: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.profit = profit;
    return this.leadRepository.save(lead);
  }

  // Получение бонусов по лидам — оставляем (если вернёмся к профиту)
  async getLeadBonuses(leadId: number): Promise<any> {
    const lead = await this.leadRepository.findOne({
      where: { id: leadId },
      relations: ['stages', 'stages.manager'],
    });

    if (!lead || !('profit' in lead) || !lead.profit) {
      throw new Error('Лид не найден или сумма не указана');
    }

    const result: {
      amount: number;
      managers: { managerId: string; name?: string; percent: number; sum: number }[];
      totalManagerBonus: number;
      ownerModel: string;
      ownerShares: { owner: string; amount: number }[];
      seniorBonus: { role: string; amount: number; name: string };
    } = {
      amount: lead.profit,
      managers: [],
      totalManagerBonus: 0,
      ownerModel: '',
      ownerShares: [],
      seniorBonus: { role: 'senior', amount: 0, name: '' },
    };

    const stagePercents = {
      stage_1: 6,
      stage_2: 3,
      stage_3: 6,
    };

    const bonusByManager: Record<number, { name?: string; percent: number; sum: number }> = {};

    for (const stage of lead.stages) {
      if (stage.status === StageStatus.COMPLETED && stagePercents[stage.type]) {
        const managerId = stage.manager?.id;
        if (!managerId) continue;

        if (!bonusByManager[managerId]) {
          bonusByManager[managerId] = {
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

    result.managers = Object.entries(bonusByManager).map(([id, val]) => ({
      managerId: id,
      ...val,
    }));

    const remaining = lead.profit - result.totalManagerBonus;
    const owners = ['owner1', 'owner2', 'owner3'];
    const share = Math.floor((remaining / owners.length) * 100) / 100;

    result.ownerModel = owners.length === 3 ? '1/3' : owners.length === 2 ? '1/2' : '100%';
    result.ownerShares = owners.map((o) => ({ owner: o, amount: share }));

    const seniorBonus = Math.floor(lead.profit * 0.1 * 100) / 100;
    result.seniorBonus = {
      role: 'senior',
      amount: seniorBonus,
      name: 'Старший менеджер',
    };

    return result;
  }

  async assignManager(id: number, managerId: number): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    lead.assigned_to = managerId;
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

    // если статус "cut" — сбросить assigned_to
    if (status === 'cut') {
      lead.assigned_to = null;
      lead.visible_to_level = 0; // должно быть 0
    }

    // если статус "to_level2" — сбросить assigned_to и обновить уровень
    if (status === 'to_level2') {
      lead.assigned_to = null;
      lead.visible_to_level = 2;
    }

    // если статус "to_level3" — сбросить assigned_to и обновить уровень
    if (status === 'to_level3') {
      lead.assigned_to = null;
      lead.visible_to_level = 3;
    }

    if (status === 'closed' && profit != null) {
      lead.profit = profit;
      lead.visible_to_level = 0;

      const leadWithStages = await this.leadRepository.findOne({
        where: { id },
        relations: ['stages', 'stages.manager'],
      });

      const stagePercents = {
        stage_1: 6,
        stage_2: 3,
        stage_3: 6,
      };

      for (const stage of leadWithStages?.stages || []) {
        if (stage.status === StageStatus.COMPLETED && stage.manager && stagePercents[stage.type]) {
          const percent = stagePercents[stage.type];
          const bonusAmount = Math.floor((profit * percent) * 100) / 100;

          const bonus = this.bonusRepository.create({
            manager: stage.manager,
            lead: lead,
            percent,
            amount: bonusAmount,
          });

          await this.bonusRepository.save(bonus);
        }
      }
    }

    return this.leadRepository.save(lead);
  }
}