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
exports.Lead = void 0;
const typeorm_1 = require("typeorm");
const stage_entity_1 = require("../stage/stage.entity");
const user_entity_1 = require("../user/user.entity");
let Lead = class Lead {
};
exports.Lead = Lead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Lead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "full_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Lead.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "zipcode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "ssn", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'date' }),
    __metadata("design:type", Date)
], Lead.prototype, "birth_date", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Lead.prototype, "lead_date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "telegram", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "source_subid", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stage_entity_1.Stage, (stage) => stage.lead, { cascade: true }),
    __metadata("design:type", Array)
], Lead.prototype, "stages", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['new', 'in_work', 'callback', 'cut', 'to_level2', 'to_level3', 'closed'],
        default: 'new',
    }),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'int' }),
    __metadata("design:type", Object)
], Lead.prototype, "assigned_to", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_to' }),
    __metadata("design:type", user_entity_1.User)
], Lead.prototype, "assignedManager", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], Lead.prototype, "visible_to_level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], Lead.prototype, "profit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Lead.prototype, "manager1Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Lead.prototype, "manager2Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Lead.prototype, "manager3Id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Lead.prototype, "call_center", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['success', 'fail'], nullable: true }),
    __metadata("design:type", String)
], Lead.prototype, "result_status", void 0);
exports.Lead = Lead = __decorate([
    (0, typeorm_1.Entity)()
], Lead);
//# sourceMappingURL=lead.entity.js.map