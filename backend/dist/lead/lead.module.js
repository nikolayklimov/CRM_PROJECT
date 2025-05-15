"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const lead_entity_1 = require("./lead.entity");
const lead_service_1 = require("./lead.service");
const lead_controller_1 = require("./lead.controller");
const audit_log_module_1 = require("../audit-log/audit-log.module");
const bonus_module_1 = require("../bonus/bonus.module");
const user_entity_1 = require("../user/user.entity");
const owner_bonus_entity_1 = require("../bonus/owner-bonus.entity");
const manager_bonus_entity_1 = require("../bonus/manager-bonus.entity");
let LeadModule = class LeadModule {
};
exports.LeadModule = LeadModule;
exports.LeadModule = LeadModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([lead_entity_1.Lead, manager_bonus_entity_1.ManagerBonus, owner_bonus_entity_1.OwnerBonus, user_entity_1.User,]),
            audit_log_module_1.AuditLogModule,
            bonus_module_1.BonusModule,
        ],
        controllers: [lead_controller_1.LeadController],
        providers: [lead_service_1.LeadService],
        exports: [lead_service_1.LeadService],
    })
], LeadModule);
//# sourceMappingURL=lead.module.js.map