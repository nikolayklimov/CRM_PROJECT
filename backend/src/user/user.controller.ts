import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin') // Только для админов
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllUsers(@Request() req): Promise<User[]> {
    console.log('Пользователь из токена:', req.user); // 🔍 Проверка
    return this.userService.findAll();
  }

  @Post()
  @Roles('admin') // Только для админов
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return this.userService.createUser(dto);
  }
}