import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StageService } from '../stage/stage.service';
import { StageType } from '../stage/stage.entity';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('call')
export class CallController {
  constructor(
    private readonly stageService: StageService,
    private readonly auditService: AuditLogService,
  ) {}

  @Post('start')
  async startCall(
    @Req() req: any,
    @Body() body: { leadId: number; managerId: number },
  ) {
    const { leadId, managerId } = body;

    const existing = await this.stageService.findActiveStage(
      leadId,
      StageType.STAGE_1,
    );
    if (existing) {
      throw new BadRequestException('Stage 1 already started for this lead');
    }

    const result = await this.stageService.create({
      type: StageType.STAGE_1,
      lead: leadId,
      manager: managerId,
      notes: 'Звонок начат вручную',
    });

    await this.auditService.logAction(
      (req.user as any)?.id,
      'POST',
      '/call/start',
      body,
      'call_start',
      result.id,
      `Менеджер ${managerId} начал звонок по лиду ${leadId}`,
    );

    return result;
  }

  @Post('end')
  async endCall(@Req() req: any, @Body() body: { stageId: number }) {
    const result = await this.stageService.completeStage(body.stageId);

    await this.auditService.logAction(
      (req.user as any)?.id,
      'POST',
      '/call/end',
      body,
      'call_end',
      result.id,
      `Звонок завершён. Этап ID ${result.id}`,
    );

    return result;
  }
}