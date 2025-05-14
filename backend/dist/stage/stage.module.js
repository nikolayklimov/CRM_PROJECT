"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stage_entity_1 = require("./stage.entity");
const stage_service_1 = require("./stage.service");
const stage_controller_1 = require("./stage.controller");
const lead_entity_1 = require("../lead/lead.entity");
const user_entity_1 = require("../user/user.entity");
const audit_log_module_1 = require("../audit-log/audit-log.module");
let StageModule = class StageModule {
};
exports.StageModule = StageModule;
exports.StageModule = StageModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([stage_entity_1.Stage, lead_entity_1.Lead, user_entity_1.User]),
            audit_log_module_1.AuditLogModule,
        ],
        providers: [stage_service_1.StageService],
        controllers: [stage_controller_1.StageController],
        exports: [stage_service_1.StageService],
    })
], StageModule);
//# sourceMappingURL=stage.module.js.map