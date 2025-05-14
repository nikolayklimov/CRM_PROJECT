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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./audit-log.entity");
const json2csv_1 = require("json2csv");
let AuditLogService = class AuditLogService {
    constructor(auditRepo) {
        this.auditRepo = auditRepo;
    }
    async logAction(userId, method, route, payload, actionType, entityId, summary) {
        const entry = this.auditRepo.create({
            userId,
            method,
            route,
            payload: JSON.stringify(payload),
            actionType,
            entityId: entityId === null || entityId === void 0 ? void 0 : entityId.toString(),
            summary,
        });
        await this.auditRepo.save(entry);
    }
    async getLogs(params) {
        const { from, to, actionType } = params;
        const query = this.auditRepo.createQueryBuilder('log');
        if (from) {
            query.andWhere('log.createdAt >= :from', { from });
        }
        if (to) {
            query.andWhere('log.createdAt <= :to', { to });
        }
        if (actionType) {
            query.andWhere('log.actionType = :actionType', { actionType });
        }
        query.orderBy('log.createdAt', 'DESC');
        return query.getMany();
    }
    async exportLogsToCSV(params) {
        const { from, to, actionType } = params;
        const query = this.auditRepo.createQueryBuilder('log');
        if (from) {
            query.andWhere('log.createdAt >= :from', { from });
        }
        if (to) {
            query.andWhere('log.createdAt <= :to', { to });
        }
        if (actionType) {
            query.andWhere('log.actionType = :actionType', { actionType });
        }
        query.orderBy('log.createdAt', 'DESC');
        const logs = await query.getMany();
        const parser = new json2csv_1.Parser({
            fields: [
                'id',
                'userId',
                'method',
                'route',
                'payload',
                'actionType',
                'entityId',
                'summary',
                'createdAt',
            ],
        });
        return parser.parse(logs);
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map