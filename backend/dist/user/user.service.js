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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const stage_entity_1 = require("../stage/stage.entity");
let UserService = class UserService {
    constructor(userRepository, stageRepository) {
        this.userRepository = userRepository;
        this.stageRepository = stageRepository;
    }
    findAll() {
        return this.userRepository.find();
    }
    async createUser(dto) {
        const user = this.userRepository.create(dto);
        return this.userRepository.save(user);
    }
    async getBonusesByUserId(userId) {
        const stages = await this.stageRepository.find({
            where: {
                manager: { id: userId },
                status: stage_entity_1.StageStatus.COMPLETED,
            },
            relations: ['lead'],
        });
        const leadMap = new Map();
        const stagePercents = {
            stage_1: 6,
            stage_2: 3,
            stage_3: 6,
        };
        for (const stage of stages) {
            const lead = stage.lead;
            if (!lead || !lead.profit)
                continue;
            if (!leadMap.has(lead.id)) {
                leadMap.set(lead.id, {
                    leadId: lead.id,
                    amount: lead.profit,
                    stagesClosed: [],
                    totalPercent: 0,
                    totalBonus: 0,
                });
            }
            const entry = leadMap.get(lead.id);
            const percent = stagePercents[stage.type] || 0;
            const bonus = (lead.profit * percent) / 100;
            entry.stagesClosed.push(stage.type);
            entry.totalPercent += percent;
            entry.totalBonus += bonus;
        }
        return Array.from(leadMap.values());
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(stage_entity_1.Stage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map