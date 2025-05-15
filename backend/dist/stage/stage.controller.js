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
exports.StageController = void 0;
const common_1 = require("@nestjs/common");
const stage_service_1 = require("./stage.service");
const create_stage_dto_1 = require("./dto/create-stage.dto");
const stage_entity_1 = require("./stage.entity");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let StageController = class StageController {
    constructor(stageService, auditService) {
        this.stageService = stageService;
        this.auditService = auditService;
    }
    async create(req, dto) {
        var _a, _b;
        const stage = await this.stageService.create(dto);
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'POST', '/stage', dto, 'create_stage', stage.id, `Создан этап: ${stage.type} для лида ${((_b = stage.lead) === null || _b === void 0 ? void 0 : _b.id) || dto.lead}`);
        return stage;
    }
    async complete(req, id) {
        var _a;
        const result = await this.stageService.completeStage(Number(id));
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'PATCH', `/stage/${id}/complete`, {}, 'complete_stage', result.id, `Завершён этап: ${result.type} (ID ${id})`);
        return result;
    }
    async getActiveStage(leadId) {
        return this.stageService.findActiveStage(leadId, stage_entity_1.StageType.STAGE_1);
    }
};
exports.StageController = StageController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_stage_dto_1.CreateStageDto]),
    __metadata("design:returntype", Promise)
], StageController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StageController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Query)('leadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StageController.prototype, "getActiveStage", null);
exports.StageController = StageController = __decorate([
    (0, common_1.Controller)('stage'),
    __metadata("design:paramtypes", [stage_service_1.StageService,
        audit_log_service_1.AuditLogService])
], StageController);
//# sourceMappingURL=stage.controller.js.map