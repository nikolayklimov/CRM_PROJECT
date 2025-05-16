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
exports.CallController = void 0;
const common_1 = require("@nestjs/common");
const stage_service_1 = require("../stage/stage.service");
const stage_entity_1 = require("../stage/stage.entity");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CallController = class CallController {
    constructor(stageService, auditService) {
        this.stageService = stageService;
        this.auditService = auditService;
    }
    async startCall(req, body) {
        var _a, _b;
        const { leadId } = body;
        const managerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!managerId) {
            throw new common_1.BadRequestException('Manager ID not found in token');
        }
        const manager = await this.stageService.getManager(managerId);
        if (!manager) {
            throw new common_1.BadRequestException('Менеджер не найден');
        }
        let stageType;
        switch (manager.managerLevel) {
            case 1:
                stageType = stage_entity_1.StageType.STAGE_1;
                break;
            case 2:
                stageType = stage_entity_1.StageType.STAGE_2;
                break;
            case 3:
                stageType = stage_entity_1.StageType.STAGE_3;
                break;
            default:
                throw new common_1.BadRequestException('Некорректный уровень менеджера');
        }
        const existing = await this.stageService.findActiveStage(leadId, stageType);
        if (existing) {
            throw new common_1.BadRequestException(`Stage ${stageType} уже начат для лида`);
        }
        const result = await this.stageService.create({
            type: stageType,
            lead: leadId,
            manager: managerId,
            notes: 'Звонок начат вручную',
        });
        await this.stageService.updateLeadStatus(leadId, 'in_work');
        await this.auditService.logAction((_b = req.user) === null || _b === void 0 ? void 0 : _b.id, 'POST', '/call/start', { leadId }, 'call_start', result.id, `Менеджер ${managerId} начал звонок по лиду ${leadId}`);
        return result;
    }
    async endCall(req, body) {
        const user = req.user;
        const result = await this.stageService.completeStageByLeadId(body.leadId, user);
        await this.auditService.logAction(user === null || user === void 0 ? void 0 : user.id, 'POST', '/call/end', body, 'call_end', result.id, `Звонок завершён. Этап ID ${result.id} по лиду ID ${body.leadId}`);
        return result;
    }
};
exports.CallController = CallController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallController.prototype, "startCall", null);
__decorate([
    (0, common_1.Post)('end'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CallController.prototype, "endCall", null);
exports.CallController = CallController = __decorate([
    (0, common_1.Controller)('call'),
    __metadata("design:paramtypes", [stage_service_1.StageService,
        audit_log_service_1.AuditLogService])
], CallController);
//# sourceMappingURL=call.controller.js.map