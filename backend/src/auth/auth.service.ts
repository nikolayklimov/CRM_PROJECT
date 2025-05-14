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
        
        console.log('👤 Регистрирую пользователя:', dto.email);


        const existing = await this.userRepository.findOne({
            where: { email: dto.email },
        });

        if (existing) {
            throw new ConflictException('Пользователь с таким email уже существует');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const user = this.userRepository.create({
            password: hashedPassword,
            email: dto.email,
            name: dto.name,
            role: dto.role,  // Убедитесь, что dto.role типизирован как 'admin' | 'manager' | 'owner'
          });

        return this.userRepository.save(user);
    }

    async login(dto: LoginDto): Promise<{ access_token: string }> {
        try {
            const user = await this.userRepository.findOne({
                where: { email: dto.email },
            });

            if (!user) {
                throw new UnauthorizedException('Неверный email или пароль');
            }

            const isValid = await bcrypt.compare(dto.password, user.password);

            if (!isValid) {
                throw new UnauthorizedException('Неверный email или пароль');
            }

            const payload = {
                sub: user.id,
                email: user.email,
                role: user.role,
            };

            const token = await this.jwtService.signAsync(payload);

            return { access_token: token };
        } catch (err) {
            console.error('Error occurred during login:', err);
            throw new UnauthorizedException('Неверный email или пароль');
        }
    }
}