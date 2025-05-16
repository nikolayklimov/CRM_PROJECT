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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyBonusSummary = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
let DailyBonusSummary = class DailyBonusSummary {
};
exports.DailyBonusSummary = DailyBonusSummary;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DailyBonusSummary.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], DailyBonusSummary.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], DailyBonusSummary.prototype, "callCenter", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], DailyBonusSummary.prototype, "managerLevel", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], DailyBonusSummary.prototype, "totalBonus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DailyBonusSummary.prototype, "date", void 0);
exports.DailyBonusSummary = DailyBonusSummary = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['user', 'date'])
], DailyBonusSummary);
//# sourceMappingURL=daily-bonus-summary.entity.js.map