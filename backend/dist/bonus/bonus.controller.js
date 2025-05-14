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
exports.BonusController = void 0;
const common_1 = require("@nestjs/common");
const bonus_service_1 = require("./bonus.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let BonusController = class BonusController {
    constructor(bonusService) {
        this.bonusService = bonusService;
    }
    async getMyTodayBonus(req) {
        const user = req.user;
        const managerId = user === null || user === void 0 ? void 0 : user.id;
        const role = user === null || user === void 0 ? void 0 : user.role;
        if (role !== 'manager') {
            return { bonus: 0 };
        }
        const total = await this.bonusService.getTodayBonusForManager(managerId);
        return { bonus: total };
    }
    async getBonusesByLead(id, req) {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'owner') {
            throw new common_1.ForbiddenException('Только владельцы могут просматривать бонусы по клиенту');
        }
        return this.bonusService.getBonusesByLead(id);
    }
};
exports.BonusController = BonusController;
__decorate([
    (0, common_1.Get)('my-today'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BonusController.prototype, "getMyTodayBonus", null);
__decorate([
    (0, common_1.Get)('by-lead/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], BonusController.prototype, "getBonusesByLead", null);
exports.BonusController = BonusController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('bonus'),
    __metadata("design:paramtypes", [bonus_service_1.BonusService])
], BonusController);
//# sourceMappingURL=bonus.controller.js.map