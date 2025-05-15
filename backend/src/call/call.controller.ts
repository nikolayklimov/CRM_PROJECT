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

    const manager = await this.stageService.getManager(managerId);
    if (!manager) {
      throw new BadRequestException('Менеджер не найден');
    }

    let stageType: StageType;
    switch (manager.managerLevel) {
      case 1:
        stageType = StageType.STAGE_1;
        break;
      case 2:
        stageType = StageType.STAGE_2;
        break;
      case 3:
        stageType = StageType.STAGE_3;
        break;
      default:
        throw new BadRequestException('Некорректный уровень менеджера');
    }

    const existing = await this.stageService.findActiveStage(leadId, stageType);
    if (existing) {
      throw new BadRequestException(`Stage ${stageType} уже начат для лида`);
    }

    const result = await this.stageService.create({
      type: stageType,
      lead: leadId,
      manager: managerId,
      notes: 'Звонок начат вручную',
    });

    await this.stageService.updateLeadStatus(leadId, 'in_work');

    await this.auditService.logAction(
      req.user?.id,
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