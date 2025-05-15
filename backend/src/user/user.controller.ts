import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request as Req,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { Roles } from '../auth/roles.decorator';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly auditService: AuditLogService,
  ) {}

  @Get()
  @Roles('admin')
  async getAllUsers(@Req() req: Request): Promise<User[]> {
    const users = await this.userService.findAll();
    await this.auditService.logAction(
      (req.user as any)?.id,
      'GET',
      '/user',
      {},
      'get_users',
      undefined,
      'Просмотр всех пользователей',
    );
    return users;
  }

  @Post()
  @Roles('admin')
  async create(@Req() req: Request, @Body() dto: CreateUserDto): Promise<User> {
    const user = await this.userService.createUser(dto);
    await this.auditService.logAction(
      (req.user as any)?.id,
      'POST',
      '/user',
      dto,
      'create_user',
      undefined,
      `Создан пользователь ${dto.email}`,
    );
    return user;
  }

  @Get(':id/bonuses')
  async getUserBonuses(@Param('id') id: number) {
    return this.userService.getBonusesByUserId(Number(id));
  }
}