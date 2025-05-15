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
exports.StageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const stage_entity_1 = require("./stage.entity");
const lead_entity_1 = require("../lead/lead.entity");
const user_entity_1 = require("../user/user.entity");
const typeorm_3 = require("typeorm");
let StageService = class StageService {
    constructor(stageRepository, dataSource) {
        this.stageRepository = stageRepository;
        this.dataSource = dataSource;
    }
    async getManager(managerId) {
        return this.dataSource.getRepository(user_entity_1.User).findOneBy({ id: managerId });
    }
    async updateLeadStatus(leadId, status) {
        await this.dataSource.getRepository(lead_entity_1.Lead).update({ id: leadId }, { status });
    }
    async create(dto) {
        const stage = this.stageRepository.create(Object.assign(Object.assign({}, dto), { lead: { id: dto.lead }, manager: { id: dto.manager } }));
        return this.stageRepository.save(stage);
    }
    async completeStage(id) {
        const stage = await this.stageRepository.findOneBy({ id });
        if (!stage) {
            throw new Error(`Stage with id ${id} not found`);
        }
        stage.status = stage_entity_1.StageStatus.COMPLETED;
        stage.finished_at = new Date();
        stage.duration_seconds = Math.floor((+stage.finished_at - +stage.started_at) / 1000);
        return this.stageRepository.save(stage);
    }
    async findActiveStage(leadId, type) {
        return this.stageRepository.findOne({
            where: {
                lead: { id: leadId },
                type,
                status: stage_entity_1.StageStatus.ACTIVE,
            },
            relations: ['lead'],
        });
    }
};
exports.StageService = StageService;
exports.StageService = StageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(stage_entity_1.Stage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_3.DataSource])
], StageService);
//# sourceMappingURL=stage.service.js.map