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
exports.LeadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const lead_service_1 = require("./lead.service");
const create_lead_dto_1 = require("./create-lead.dto");
const sync_1 = require("csv-parse/sync");
const audit_log_service_1 = require("../audit-log/audit-log.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const update_lead_dto_1 = require("./update-lead.dto");
let LeadController = class LeadController {
    constructor(leadService, auditService) {
        this.leadService = leadService;
        this.auditService = auditService;
    }
    async getAll(req) {
        return this.leadService.findAll(req.user);
    }
    async create(req, dto) {
        var _a;
        const lead = await this.leadService.createLead(dto);
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'POST', '/lead', dto, 'create_lead', lead.id, `Создан лид: ${lead.full_name} (ID ${lead.id})`);
        return lead;
    }
    async importCsv(file) {
        const csvText = file.buffer.toString();
        const records = (0, sync_1.parse)(csvText, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        const createdLeads = [];
        for (const row of records) {
            const lead = await this.leadService.createLead(Object.assign(Object.assign({}, row), { status: 'new' }));
            createdLeads.push(lead);
        }
        return createdLeads;
    }
    async updateStatus(req, id, status, visibleToLevel) {
        var _a;
        const lead = await this.leadService.updateStatus(id, status, visibleToLevel);
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'PATCH', `/lead/${id}/status`, { status, visibleToLevel }, 'update_status', lead.id, `Обновлён статус лида: ${lead.full_name} (ID ${lead.id}) → ${status}, уровень видимости → ${visibleToLevel}`);
        return lead;
    }
    async updateProfit(req, id, profit) {
        var _a;
        const lead = await this.leadService.updateProfit(id, profit);
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'PATCH', `/lead/${id}/profit`, { profit }, 'update_profit', lead.id, `Обновлён профит лида: ${lead.full_name} (ID ${lead.id}) на ${profit}`);
        return lead;
    }
    async assignManager(req, id) {
        var _a;
        const managerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const user = req.user;
        if (!managerId) {
            throw new Error('Manager ID not found in token');
        }
        const lead = await this.leadService.assignManager(id, managerId, user);
        await this.auditService.logAction(managerId, 'PATCH', `/lead/${id}/assign`, {}, 'assign_manager', lead.id, `Назначен менеджер ID ${managerId} для лида: ${lead.full_name} (ID ${lead.id})`);
        return lead;
    }
    async afterCall(req, id, body) {
        var _a;
        const { status, notes, profit } = body;
        const lead = await this.leadService.handleAfterCall(id, status, notes !== null && notes !== void 0 ? notes : '', profit, req.user);
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'POST', `/lead/${id}/after-call`, body, 'after_call', id, `Итог звонка: ${status} (лид ID ${id})`);
        return lead;
    }
    async handleAfterCall(req, id, body) {
        var _a;
        const { status, note, profit } = body;
        const lead = await this.leadService.handleAfterCall(id, status, note !== null && note !== void 0 ? note : '', profit, req.user);
        await this.auditService.logAction((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, 'PATCH', `/lead/${id}/after-call`, { status, note, profit }, 'after_call_update', lead.id, `После звонка: ${lead.full_name} (ID ${lead.id}) → статус: ${status}`);
        return lead;
    }
    async updateLeadFields(id, dto, req) {
        const user = req.user;
        return this.leadService.updateLeadFields(+id, dto, user);
    }
    async getBonus(id) {
        return this.leadService.getLeadBonuses(id);
    }
};
exports.LeadController = LeadController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lead_dto_1.CreateLeadDto]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('import'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "importCsv", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Body)('visibleToLevel')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, Number]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/profit'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('profit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "updateProfit", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "assignManager", null);
__decorate([
    (0, common_1.Post)(':id/after-call'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "afterCall", null);
__decorate([
    (0, common_1.Patch)(':id/after-call'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "handleAfterCall", null);
__decorate([
    (0, common_1.Patch)(':id/edit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_lead_dto_1.UpdateLeadDto, Object]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "updateLeadFields", null);
__decorate([
    (0, common_1.Get)(':id/bonus'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getBonus", null);
exports.LeadController = LeadController = __decorate([
    (0, common_1.Controller)('lead'),
    __metadata("design:paramtypes", [lead_service_1.LeadService,
        audit_log_service_1.AuditLogService])
], LeadController);
//# sourceMappingURL=lead.controller.js.map