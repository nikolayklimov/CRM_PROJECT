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
exports.LeadChangeLog = void 0;
const typeorm_1 = require("typeorm");
const lead_entity_1 = require("./lead.entity");
const user_entity_1 = require("../user/user.entity");
let LeadChangeLog = class LeadChangeLog {
};
exports.LeadChangeLog = LeadChangeLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LeadChangeLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lead_entity_1.Lead, { onDelete: 'CASCADE' }),
    __metadata("design:type", lead_entity_1.Lead)
], LeadChangeLog.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    __metadata("design:type", user_entity_1.User)
], LeadChangeLog.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LeadChangeLog.prototype, "field", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeadChangeLog.prototype, "oldValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], LeadChangeLog.prototype, "newValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LeadChangeLog.prototype, "createdAt", void 0);
exports.LeadChangeLog = LeadChangeLog = __decorate([
    (0, typeorm_1.Entity)()
], LeadChangeLog);
//# sourceMappingURL=lead-change-log.entity.js.map