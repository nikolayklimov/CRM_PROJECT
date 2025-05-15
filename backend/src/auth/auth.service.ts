import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto): Promise<User> {
        console.log('👤 Регистрирую пользователя:', dto.name);

        const existing = await this.userRepository.findOne({
            where: { name: dto.name },
        });

        if (existing) {
            throw new ConflictException('Пользователь с таким именем уже существует');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            name: dto.name,
            password: hashedPassword,
            role: dto.role,
            managerLevel: dto.role === 'manager' ? dto.managerLevel ?? 1 : undefined,
        });

        return this.userRepository.save(user);
    }

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        console.log('Login attempt:', dto.name);
        const user = await this.userRepository.findOne({
            where: { name: dto.name },
        });

        if (!user) {
            throw new UnauthorizedException('Неверное имя или пароль');
        }

        const isValid = await bcrypt.compare(dto.password, user.password);

        if (!isValid) {
            throw new UnauthorizedException('Неверное имя или пароль');
        }

        const payload = {
            sub: user.id,
            name: user.name,
            role: user.role,
        };

        const token = await this.jwtService.signAsync(payload);
        return { access_token: token };
    }
}