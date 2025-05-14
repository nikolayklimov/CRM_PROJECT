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
exports.Stage = exports.StageStatus = exports.StageType = void 0;
const typeorm_1 = require("typeorm");
const lead_entity_1 = require("../lead/lead.entity");
const user_entity_1 = require("../user/user.entity");
var StageType;
(function (StageType) {
    StageType["STAGE_1"] = "stage_1";
    StageType["STAGE_2"] = "stage_2";
    StageType["STAGE_3"] = "stage_3";
})(StageType || (exports.StageType = StageType = {}));
var StageStatus;
(function (StageStatus) {
    StageStatus["ACTIVE"] = "active";
    StageStatus["COMPLETED"] = "completed";
    StageStatus["FAILED"] = "failed";
    StageStatus["SKIPPED"] = "skipped";
})(StageStatus || (exports.StageStatus = StageStatus = {}));
let Stage = class Stage {
};
exports.Stage = Stage;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Stage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StageType,
    }),
    __metadata("design:type", String)
], Stage.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => lead_entity_1.Lead, (lead) => lead.stages, { onDelete: 'CASCADE' }),
    __metadata("design:type", lead_entity_1.Lead)
], Stage.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.stages),
    __metadata("design:type", user_entity_1.User)
], Stage.prototype, "manager", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StageStatus, default: StageStatus.ACTIVE }),
    __metadata("design:type", String)
], Stage.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Stage.prototype, "started_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Stage.prototype, "finished_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Stage.prototype, "duration_seconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Stage.prototype, "notes", void 0);
exports.Stage = Stage = __decorate([
    (0, typeorm_1.Entity)()
], Stage);
//# sourceMappingURL=stage.entity.js.map