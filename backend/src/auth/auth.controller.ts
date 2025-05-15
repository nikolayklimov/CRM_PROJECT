import { Controller, Post, Body, ForbiddenException, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/user.entity';
import { Request } from 'express';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request): Promise<User> {
    const user = req.user as any;

    if (dto.role === 'admin' && user.role !== 'owner') {
      throw new ForbiddenException('Только владелец может создать админа');
    }

    if (dto.role === 'manager' && !['admin', 'owner'].includes(user.role)) {
      throw new ForbiddenException('Только владелец или админ может создать менеджера');
    }

    if (!['admin', 'manager'].includes(dto.role)) {
      throw new ForbiddenException('Эту роль создать нельзя');
    }

    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    console.log('Received login DTO:', dto);
    return this.authService.login(dto);
  }
}