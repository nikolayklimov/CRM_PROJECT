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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../user/user.entity");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        var _a, _b;
        console.log('👤 Регистрирую пользователя:', dto.name);
        const existing = await this.userRepository.findOne({
            where: { name: dto.name },
        });
        if (existing) {
            throw new common_1.ConflictException('Пользователь с таким именем уже существует');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            name: dto.name,
            password: hashedPassword,
            role: dto.role,
            managerLevel: dto.role === 'manager' ? (_a = dto.managerLevel) !== null && _a !== void 0 ? _a : 1 : undefined,
            callCenter: dto.role === 'manager' ? (_b = dto.callCenter) !== null && _b !== void 0 ? _b : 1 : undefined,
        });
        return this.userRepository.save(user);
    }
    async login(dto) {
        console.log('Login attempt:', dto.name);
        const user = await this.userRepository.findOne({
            where: { name: dto.name },
            select: ['id', 'name', 'password', 'role', 'managerLevel', 'callCenter'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Неверное имя или пароль');
        }
        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('Неверное имя или пароль');
        }
        const payload = {
            sub: user.id,
            name: user.name,
            role: user.role,
            managerLevel: user.managerLevel,
            callCenter: user.callCenter,
        };
        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map