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
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const sync_1 = require("csv-parse/sync");
let LeadController = class LeadController {
    constructor(leadService) {
        this.leadService = leadService;
    }
    async getAll() {
        return this.leadService.findAll();
    }
    async create(dto) {
        return this.leadService.createLead(dto);
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
            const lead = await this.leadService.createLead(row);
            createdLeads.push(lead);
        }
        return createdLeads;
    }
};
exports.LeadController = LeadController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeadController.prototype, "getAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_lead_dto_1.CreateLeadDto]),
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
exports.LeadController = LeadController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('lead'),
    __metadata("design:paramtypes", [lead_service_1.LeadService])
], LeadController);
//# sourceMappingURL=lead.controller.js.map