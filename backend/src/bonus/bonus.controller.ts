import { Controller, Get, Req, UseGuards, Param, ForbiddenException } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService) {}

  @Get('my-today')
  async getMyTodayBonus(@Req() req: Request & { user?: any }) {
    const user = req.user;
    const managerId = user?.id;
    const role = user?.role;

    if (role !== 'manager') {
      return { bonus: 0 }; // Только менеджеры имеют бонусы
    }

    const total = await this.bonusService.getTodayBonusForManager(managerId);
    return { bonus: total };
  }

  @Get('by-lead/:id')
  @UseGuards(JwtAuthGuard)
    async getBonusesByLead(@Param('id') id: number, @Req() req: Request & { user?: any }) {
    if (req.user?.role !== 'owner') {
        throw new ForbiddenException('Только владельцы могут просматривать бонусы по клиенту');
    }
    return this.bonusService.getBonusesByLead(id);
  }
}