"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const lead_entity_1 = require("./lead.entity");
const stage_entity_1 = require("../stage/stage.entity");
const manager_bonus_entity_1 = require("../bonus/manager-bonus.entity");
const owner_bonus_entity_1 = require("../bonus/owner-bonus.entity");
const user_entity_1 = require("../user/user.entity");
const lead_note_entity_1 = require("./lead-note/lead-note.entity");
const lead_change_log_entity_1 = require("./lead-change-log.entity");
const daily_bonus_summary_entity_1 = require("../bonus/daily-bonus-summary.entity");
const phone_mask_1 = require("../utils/phone-mask");
let LeadService = class LeadService {
    constructor(leadRepository, bonusRepository, ownerBonusRepository, userRepository, leadNoteRepository, leadChangeLogRepository, dailySummaryRepository) {
        this.leadRepository = leadRepository;
        this.bonusRepository = bonusRepository;
        this.ownerBonusRepository = ownerBonusRepository;
        this.userRepository = userRepository;
        this.leadNoteRepository = leadNoteRepository;
        this.leadChangeLogRepository = leadChangeLogRepository;
        this.dailySummaryRepository = dailySummaryRepository;
    }
    async findAll(user) {
        if (!user) {
            throw new Error('User is undefined');
        }
        let leads = [];
        if (user.role === 'admin' || user.role === 'owner') {
            leads = await this.leadRepository.find();
        }
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
                        status: (0, typeorm_2.Not)('closed'),
                    },
                ],
            });
            leads = leads.map((lead) => (Object.assign(Object.assign({}, lead), { phone: (0, phone_mask_1.maskPhone)(lead.phone) })));
        }
        return leads;
    }
    async createLead(dto) {
        const lead = this.leadRepository.create(Object.assign(Object.assign({}, dto), { status: 'new' }));
        return this.leadRepository.save(lead);
    }
    async updateStatus(id, status, visibleToLevel) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        lead.status = status;
        if (visibleToLevel !== undefined) {
            lead.visible_to_level = visibleToLevel;
        }
        return this.leadRepository.save(lead);
    }
    async updateProfit(id, profit) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        lead.profit = profit;
        return this.leadRepository.save(lead);
    }
    async getLeadBonuses(leadId) {
        var _a;
        const lead = await this.leadRepository.find({
            where: { id: leadId },
            relations: ['stages', 'stages.manager'],
        }).then((res) => res[0]);
        if (!lead || !lead.profit) {
            throw new Error('Лид не найден или сумма не указана');
        }
        const result = {
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
        const bonusByManager = {};
        for (const stage of lead.stages) {
            if (stage.status === stage_entity_1.StageStatus.COMPLETED && stagePercents[stage.type]) {
                const managerId = (_a = stage.manager) === null || _a === void 0 ? void 0 : _a.id;
                if (!managerId)
                    continue;
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
    async assignManager(id, managerId, user) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        const canSee = (user.role === 'manager' &&
            lead.status === 'new' &&
            lead.visible_to_level === user.managerLevel &&
            lead.call_center === user.callCenter &&
            lead.assigned_to === null);
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
        if ((manager === null || manager === void 0 ? void 0 : manager.role) === 'manager') {
            if (manager.managerLevel === 1 && !lead.manager1Id) {
                lead.manager1Id = managerId;
            }
            else if (manager.managerLevel === 2 && !lead.manager2Id) {
                lead.manager2Id = managerId;
            }
            else if (manager.managerLevel === 3 && !lead.manager3Id) {
                lead.manager3Id = managerId;
            }
        }
        return this.leadRepository.save(lead);
    }
    async handleAfterCall(id, status, notes, profit, user) {
        var _a;
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        const canAccess = user.role === 'admin' || user.role === 'owner' ||
            (user.role === 'manager' &&
                lead.visible_to_level === user.managerLevel &&
                lead.assigned_to === user.id &&
                lead.status !== 'closed');
        if (!canAccess) {
            throw new Error('Нет доступа к этому лиду');
        }
        if (user.role === 'manager') {
            lead.call_center = (_a = user.callCenter) !== null && _a !== void 0 ? _a : 1;
            if (user.managerLevel === 1) {
                lead.manager1Id = user.id;
            }
            else if (user.managerLevel === 2) {
                lead.manager2Id = user.id;
            }
            else if (user.managerLevel === 3) {
                lead.manager3Id = user.id;
            }
        }
        if (status === 'new' &&
            user.role === 'manager' &&
            lead.assigned_to === user.id &&
            (user.managerLevel === 1 || user.managerLevel === 2)) {
            const nextLevel = user.managerLevel + 1;
            lead.assigned_to = null;
            lead.visible_to_level = nextLevel;
            lead.status = 'new';
        }
        else if (status === 'cut') {
            lead.assigned_to = null;
            lead.visible_to_level = 0;
            lead.result_status = 'fail';
            lead.status = 'cut';
        }
        else if (status === 'closed' && profit != null) {
            lead.assigned_to = null;
            lead.visible_to_level = 0;
            lead.profit = profit;
            lead.result_status = 'success';
            lead.status = 'closed';
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
            for (const stage of (leadWithStages === null || leadWithStages === void 0 ? void 0 : leadWithStages.stages) || []) {
                if (stage.status === stage_entity_1.StageStatus.COMPLETED &&
                    stage.manager &&
                    stagePercents[stage.type]) {
                    const percent = stagePercents[stage.type];
                    const bonusAmount = Math.floor((profit * percent / 100) * 100) / 100;
                    await this.bonusRepository.save(this.bonusRepository.create({
                        manager: stage.manager,
                        lead: lead,
                        percent,
                        amount: bonusAmount,
                    }));
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
                    }
                    else {
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
            const owners = await this.userRepository.find({ where: { role: 'owner' } });
            const remaining = profit - totalManagerBonus;
            const share = Math.floor((remaining / owners.length) * 100) / 100;
            for (const owner of owners) {
                await this.ownerBonusRepository.save(this.ownerBonusRepository.create({
                    owner,
                    lead,
                    amount: share,
                }));
                const existingSummary = await this.dailySummaryRepository.findOne({
                    where: {
                        user: { id: owner.id },
                        date: today,
                    },
                });
                if (existingSummary) {
                    existingSummary.totalBonus += share;
                    await this.dailySummaryRepository.save(existingSummary);
                }
                else {
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
        await this.leadNoteRepository.save({
            lead: { id: lead.id },
            manager: { id: user.id },
            note: notes,
            managerLevel: user.managerLevel,
            callCenter: user.callCenter,
        });
        return this.leadRepository.save(lead);
    }
    async updateLeadFields(id, dto, user) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        const canAccess = user.role === 'admin' || user.role === 'owner' ||
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
};
exports.LeadService = LeadService;
exports.LeadService = LeadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __param(1, (0, typeorm_1.InjectRepository)(manager_bonus_entity_1.ManagerBonus)),
    __param(2, (0, typeorm_1.InjectRepository)(owner_bonus_entity_1.OwnerBonus)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(lead_note_entity_1.LeadNote)),
    __param(5, (0, typeorm_1.InjectRepository)(lead_change_log_entity_1.LeadChangeLog)),
    __param(6, (0, typeorm_1.InjectRepository)(daily_bonus_summary_entity_1.DailyBonusSummary)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], LeadService);
//# sourceMappingURL=lead.service.js.map