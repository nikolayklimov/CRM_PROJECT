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
exports.OwnerBonus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../user/user.entity");
const lead_entity_1 = require("../lead/lead.entity");
let OwnerBonus = class OwnerBonus {
};
exports.OwnerBonus = OwnerBonus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OwnerBonus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'ownerId' }),
    __metadata("design:type", user_entity_1.User)
], OwnerBonus.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OwnerBonus.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lead_entity_1.Lead),
    __metadata("design:type", lead_entity_1.Lead)
], OwnerBonus.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], OwnerBonus.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OwnerBonus.prototype, "created_at", void 0);
exports.OwnerBonus = OwnerBonus = __decorate([
    (0, typeorm_1.Entity)()
], OwnerBonus);
//# sourceMappingURL=owner-bonus.entity.js.map