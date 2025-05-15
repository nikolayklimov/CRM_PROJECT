import { Controller, Post, Body, Param, Patch, Req, UseGuards, Query, Get, } from '@nestjs/common';
import { StageService } from './stage.service';
import { CreateStageDto } from './dto/create-stage.dto';
import { Stage, StageType } from './stage.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';

@Controller('stage')
export class StageController {
  constructor(
    private readonly stageService: StageService,
    private readonly auditService: AuditLogService,
  ) {}

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateStageDto): Promise<Stage> {
    const stage = await this.stageService.create(dto);

    await this.auditService.logAction(
      (req.user as any)?.id,
      'POST',
      '/stage',
      dto,
      'create_stage',
      stage.id,
      `Создан этап: ${stage.type} для лида ${stage.lead?.id || dto.lead}`,
    );

    return stage;
  }

  @Patch(':id/complete')
  async complete(@Req() req: Request, @Param('id') id: string): Promise<Stage> {
    const result = await this.stageService.completeStage(Number(id));

    await this.auditService.logAction(
      (req.user as any)?.id,
      'PATCH',
      `/stage/${id}/complete`,
      {},
      'complete_stage',
      result.id,
      `Завершён этап: ${result.type} (ID ${id})`,
    );

    return result;
  }

  @Get('active')
  async getActiveStage(@Query('leadId') leadId: number): Promise<Stage | null> {
    return this.stageService.findActiveStage(leadId, StageType.STAGE_1);
  }
}