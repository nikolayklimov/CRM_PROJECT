import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { StageStatus } from '../stage/stage.entity';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';
import { User } from '../user/user.entity';
import { ManagerBonusInfo, LeadBonusResult } from './types/lead-bonus-result.interface';
import { LeadNote } from './lead-note/lead-note.entity'
import { UpdateLeadDto } from './update-lead.dto';
import { LeadChangeLog } from './lead-change-log.entity';
import { DailyBonusSummary } from '../bonus/daily-bonus-summary.entity';
import { maskPhone } from '../utils/phone-mask';

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
    @InjectRepository(LeadNote)
    private leadNoteRepository: Repository<LeadNote>,
    @InjectRepository(LeadChangeLog)
    private leadChangeLogRepository: Repository<LeadChangeLog>,
    @InjectRepository(DailyBonusSummary)
    private dailySummaryRepository: Repository<DailyBonusSummary>,
  ) {}


  async findAll(user?: User): Promise<Lead[]> {
    if (!user) {
      throw new Error('User is undefined');
    }

    let leads: Lead[] = [];

    // 👑 Админы и владельцы видят всё без маскировки
    if (user.role === 'admin' || user.role === 'owner') {
      leads = await this.leadRepository.find();
    }

    // 👷 Менеджеры — фильтрация и маскировка телефона
    if (user.role === 'manager') {
      leads = await this.leadRepository.find({
        where: [
          {
            status: 'new',
            visible_to_level: user.managerLevel,
            call_center: user.callCenter,
          },
          {
            assigned_to: user.id,
            visible_to_level: user.managerLevel,
            call_center: user.callCenter,
            status: Not('closed'),
          },
        ],
      });

      leads = leads.map((lead) => ({
        ...lead,
        phone: maskPhone(lead.phone),
      }));
    }

    return leads;
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

    // 👥 Менеджеры
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

    // 👑 Владельцы
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

  async assignManager(id: number, managerId: number, user: User): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    // Проверка: менеджер может брать себе только лидов, которых он "видит"
    const canSee = (
      user.role === 'manager' &&
      lead.status === 'new' &&
      lead.visible_to_level === user.managerLevel &&
      lead.call_center === user.callCenter &&
      lead.assigned_to === null
    );

    if (!canSee) {
      throw new Error('Вы не можете назначить себе этого лида — нет доступа или он уже назначен');
    }

    if (user.role !== 'manager' || user.id !== managerId) {
      throw new Error('Менеджер может назначать только себя');
    }

    if (lead.assigned_to !== null || lead.status !== 'new') {
      throw new Error('Лид уже назначен или находится не в статусе "new"');
    }

    lead.assigned_to = managerId;

    if (lead.status === 'new') {
      lead.status = 'in_work';
    }

    const manager = await this.userRepository.findOneBy({ id: managerId });

    if (manager?.role === 'manager') {
      if (manager.managerLevel === 1 && !lead.manager1Id) {
        lead.manager1Id = managerId;
      } else if (manager.managerLevel === 2 && !lead.manager2Id) {
        lead.manager2Id = managerId;
      } else if (manager.managerLevel === 3 && !lead.manager3Id) {
        lead.manager3Id = managerId;
      }
    }

    return this.leadRepository.save(lead);
  }

  async handleAfterCall(
    id: number,
    status: Lead['status'],
    notes: string,
    profit: number | undefined,
    user: { id: number; role: string; managerLevel?: number; callCenter?: number },
  ): Promise<Lead> {

    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    const canAccess =
      user.role === 'admin' || user.role === 'owner' ||
      (user.role === 'manager' &&
        lead.visible_to_level === user.managerLevel &&
        lead.assigned_to === user.id &&
        lead.status !== 'closed');

    if (!canAccess) {
      throw new Error('Нет доступа к этому лиду');
    }

    // сохраняем КЦ
    if (user.role === 'manager') {
      lead.call_center = user.callCenter ?? 1;

      // сохраняем ID менеджера этапа
      if (user.managerLevel === 1) {
        lead.manager1Id = user.id;
      } else if (user.managerLevel === 2) {
        lead.manager2Id = user.id;
      } else if (user.managerLevel === 3) {
        lead.manager3Id = user.id;
      }
    }

    // ✅ если передают со статусом "new" — это сигнал передать на след. уровень
    if (
      status === 'new' &&
      user.role === 'manager' &&
      lead.assigned_to === user.id &&
      (user.managerLevel === 1 || user.managerLevel === 2)
    ) {
      const nextLevel = user.managerLevel + 1;

      lead.assigned_to = null;
      lead.visible_to_level = nextLevel;
      lead.status = 'new';
    }

    // ❌ если это срез
    else if (status === 'cut') {
      lead.assigned_to = null;
      lead.visible_to_level = 0;
      lead.result_status = 'fail';
      lead.status = 'cut';
    }

    // ✅ если это закрытие сделки
    else if (status === 'closed' && profit != null) {
      lead.assigned_to = null;
      lead.visible_to_level = 0;
      lead.profit = profit;
      lead.result_status = 'success';
      lead.status = 'closed';

      // бонусы — оставить как есть
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
      const today = new Date().toISOString().split('T')[0];

      // 🧮 Менеджеры
      for (const stage of leadWithStages?.stages || []) {
        if (
          stage.status === StageStatus.COMPLETED &&
          stage.manager &&
          stagePercents[stage.type]
        ) {
          const percent = stagePercents[stage.type];
          const bonusAmount = Math.floor((profit * percent / 100) * 100) / 100;

          await this.bonusRepository.save(
            this.bonusRepository.create({
              manager: stage.manager,
              lead: lead,
              percent,
              amount: bonusAmount,
            })
          );

          totalManagerBonus += bonusAmount;

          const existing = await this.dailySummaryRepository.findOne({
            where: {
              user: { id: stage.manager.id },
              date: today,
            },
          });

          if (existing) {
            existing.totalBonus += bonusAmount;
            await this.dailySummaryRepository.save(existing);
          } else {
            await this.dailySummaryRepository.save({
              user: { id: stage.manager.id },
              callCenter: stage.manager.callCenter,
              managerLevel: stage.manager.managerLevel,
              totalBonus: bonusAmount,
              date: today,
            });
          }
        }
      }

      // 🧮 Владельцы
      const owners = await this.userRepository.find({ where: { role: 'owner' } });
      const remaining = profit - totalManagerBonus;
      const share = Math.floor((remaining / owners.length) * 100) / 100;

      for (const owner of owners) {
        await this.ownerBonusRepository.save(
          this.ownerBonusRepository.create({
            owner,
            lead,
            amount: share,
          })
        );

        const existingSummary = await this.dailySummaryRepository.findOne({
          where: {
            user: { id: owner.id },
            date: today,
          },
        });

        if (existingSummary) {
          existingSummary.totalBonus += share;
          await this.dailySummaryRepository.save(existingSummary);
        } else {
          await this.dailySummaryRepository.save({
            user: { id: owner.id },
            callCenter: lead.call_center,
            managerLevel: 0,
            totalBonus: share,
            date: today,
          });
        }
      }
    }

    // сохраняем заметку
    await this.leadNoteRepository.save({
      lead: { id: lead.id },
      manager: { id: user.id },
      note: notes,
      managerLevel: user.managerLevel,
      callCenter: user.callCenter,
    });

    return this.leadRepository.save(lead);
  }

  async updateLeadFields(id: number, dto: UpdateLeadDto, user: User): Promise<Lead> {
    const lead = await this.leadRepository.findOneBy({ id });
    if (!lead) throw new Error(`Lead with id ${id} not found`);

    const canAccess =
      user.role === 'admin' || user.role === 'owner' ||
      (user.role === 'manager' &&
        lead.visible_to_level === user.managerLevel &&
        lead.assigned_to === user.id &&
        lead.status !== 'closed');

    if (!canAccess) {
      throw new Error('Нет доступа к редактированию этого лида');
    }

    const allowedFields = Object.keys(dto).filter((key) => key !== 'phone');

    for (const field of allowedFields) {
      const oldValue = lead[field];
      const newValue = dto[field];

      if (oldValue !== newValue) {
        await this.leadChangeLogRepository.save({
          lead: { id },
          manager: { id: user.id },
          field,
          oldValue,
          newValue,
        });

        lead[field] = newValue;
      }
    }

    return this.leadRepository.save(lead);
  }
}