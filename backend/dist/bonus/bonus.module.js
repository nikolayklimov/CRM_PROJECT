"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BonusModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bonus_controller_1 = require("./bonus.controller");
const bonus_service_1 = require("./bonus.service");
const manager_bonus_entity_1 = require("./manager-bonus.entity");
let BonusModule = class BonusModule {
};
exports.BonusModule = BonusModule;
exports.BonusModule = BonusModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([manager_bonus_entity_1.ManagerBonus])],
        controllers: [bonus_controller_1.BonusController],
        providers: [bonus_service_1.BonusService],
        exports: [
            bonus_service_1.BonusService,
            typeorm_1.TypeOrmModule,
        ],
    })
], BonusModule);
//# sourceMappingURL=bonus.module.js.map