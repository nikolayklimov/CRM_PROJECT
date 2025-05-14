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
const bonus_entity_1 = require("../bonus/bonus.entity");
let LeadService = class LeadService {
    constructor(leadRepository, bonusRepository) {
        this.leadRepository = leadRepository;
        this.bonusRepository = bonusRepository;
    }
    findAll() {
        return this.leadRepository.find();
    }
    async createLead(dto) {
        const lead = this.leadRepository.create(Object.assign(Object.assign({}, dto), { status: 'new' }));
        return this.leadRepository.save(lead);
    }
    async updateStatus(id, status) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        lead.status = status;
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
        const lead = await this.leadRepository.findOne({
            where: { id: leadId },
            relations: ['stages', 'stages.manager'],
        });
        if (!lead || !('profit' in lead) || !lead.profit) {
            throw new Error('Лид не найден или сумма не указана');
        }
        const result = {
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
        const bonusByManager = {};
        for (const stage of lead.stages) {
            if (stage.status === stage_entity_1.StageStatus.COMPLETED && stagePercents[stage.type]) {
                const managerId = (_a = stage.manager) === null || _a === void 0 ? void 0 : _a.id;
                if (!managerId)
                    continue;
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
        result.managers = Object.entries(bonusByManager).map(([id, val]) => (Object.assign({ managerId: id }, val)));
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
    async assignManager(id, managerId) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
        lead.assigned_to = managerId;
        return this.leadRepository.save(lead);
    }
    async handleAfterCall(id, status, notes, profit, user) {
        const lead = await this.leadRepository.findOneBy({ id });
        if (!lead)
            throw new Error(`Lead with id ${id} not found`);
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
            const leadWithStages = await this.leadRepository.findOne({
                where: { id },
                relations: ['stages', 'stages.manager'],
            });
            const stagePercents = {
                stage_1: 6,
                stage_2: 3,
                stage_3: 6,
            };
            for (const stage of (leadWithStages === null || leadWithStages === void 0 ? void 0 : leadWithStages.stages) || []) {
                if (stage.status === stage_entity_1.StageStatus.COMPLETED && stage.manager && stagePercents[stage.type]) {
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
};
exports.LeadService = LeadService;
exports.LeadService = LeadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(lead_entity_1.Lead)),
    __param(1, (0, typeorm_1.InjectRepository)(bonus_entity_1.Bonus)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LeadService);
//# sourceMappingURL=lead.service.js.map