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
exports.BonusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const manager_bonus_entity_1 = require("./manager-bonus.entity");
const date_fns_1 = require("date-fns");
let BonusService = class BonusService {
    constructor(bonusRepository) {
        this.bonusRepository = bonusRepository;
    }
    async getTodayBonusForManager(managerId) {
        const todayStart = (0, date_fns_1.startOfDay)(new Date());
        const todayEnd = (0, date_fns_1.endOfDay)(new Date());
        const bonuses = await this.bonusRepository.find({
            where: {
                manager: { id: managerId },
                created_at: (0, typeorm_2.Between)(todayStart, todayEnd),
            },
            relations: ['manager'],
        });
        return bonuses.reduce((total, b) => total + b.amount, 0);
    }
    async getBonusesByLead(leadId) {
        return this.bonusRepository.find({
            where: { lead: { id: leadId } },
            relations: ['manager', 'lead'],
        });
    }
};
exports.BonusService = BonusService;
exports.BonusService = BonusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(manager_bonus_entity_1.ManagerBonus)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BonusService);
//# sourceMappingURL=bonus.service.js.map