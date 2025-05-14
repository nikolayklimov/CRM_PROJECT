import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { CreateLeadDto } from './create-lead.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { parse } from 'csv-parse/sync';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('lead')
export class LeadController {
  constructor(
    private readonly leadService: LeadService,
    private readonly auditService: AuditLogService,
  ) {}

  @Get()
  async getAll(): Promise<Lead[]> {
    return this.leadService.findAll();
  }

  @Post()
  async create(
    @Req() req: Request & { user?: any },
    @Body() dto: CreateLeadDto,
  ): Promise<Lead> {
    const lead = await this.leadService.createLead(dto);

    await this.auditService.logAction(
      (req.user as any)?.id,
      'POST',
      '/lead',
      dto,
      'create_lead',
      lead.id,
      `Создан лид: ${lead.full_name} (ID ${lead.id})`,
    );

    return lead;
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importCsv(@UploadedFile() file: Express.Multer.File): Promise<Lead[]> {
    const csvText = file.buffer.toString();
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    const createdLeads: Lead[] = [];

    for (const row of records) {
      const lead = await this.leadService.createLead({
        ...row,
        status: 'new',
      });
      createdLeads.push(lead);
    }

    return createdLeads;
  }

  // ✅ Новый метод: обновление статуса
  @Patch(':id/status')
  async updateStatus(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body('status') status: string,
  ): Promise<Lead> {
    const lead = await this.leadService.updateStatus(id, status);

    await this.auditService.logAction(
      (req.user as any)?.id,
      'PATCH',
      `/lead/${id}/status`,
      { status },
      'update_status',
      lead.id,
      `Обновлён статус лида: ${lead.full_name} (ID ${lead.id}) → ${status}`,
    );

    return lead;
  }

  // ✅ Обновление профита (только для менеджеров 3-го звена)
  @Patch(':id/profit')
  async updateProfit(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body('profit') profit: number,
  ): Promise<Lead> {
    const lead = await this.leadService.updateProfit(id, profit);

    await this.auditService.logAction(
      (req.user as any)?.id,
      'PATCH',
      `/lead/${id}/profit`,
      { profit },
      'update_profit',
      lead.id,
      `Обновлён профит лида: ${lead.full_name} (ID ${lead.id}) на ${profit}`,
    );

    return lead;
  }

  @Patch(':id/assign')
  async assignManager(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body('managerId') managerId: number,
  ): Promise<Lead> {
    const lead = await this.leadService.assignManager(id, managerId);

    await this.auditService.logAction(
      (req.user as any)?.id,
      'PATCH',
      `/lead/${id}/assign`,
      { managerId },
      'assign_manager',
      lead.id,
      `Назначен менеджер ID ${managerId} для лида: ${lead.full_name} (ID ${lead.id})`,
    );

    return lead;
  }

  @Post(':id/after-call')
  async afterCall(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body() body: { status: string; notes?: string; profit?: number },
  ): Promise<Lead> {
    const { status, notes, profit } = body;

    const lead = await this.leadService.handleAfterCall(
      id,
      status as Lead['status'],
      notes ?? '',
      profit,
      req.user
    );

    await this.auditService.logAction(
      req.user?.id,
      'POST',
      `/lead/${id}/after-call`,
      body,
      'after_call',
      id,
      `Итог звонка: ${status} (лид ID ${id})`,
    );

    return lead;
  }

  @Patch(':id/after-call')
  async handleAfterCall(
    @Req() req: Request & { user?: any },
    @Param('id') id: number,
    @Body() body: { status: Lead['status']; notes: string; profit?: number }
  ): Promise<Lead> {
    const { status, notes, profit } = body;

    const lead = await this.leadService.handleAfterCall(id, status, notes, profit, req.user);
    
    await this.auditService.logAction(
      req.user?.id,
      'PATCH',
      `/lead/${id}/after-call`,
      { status, notes, profit },
      'after_call_update',
      lead.id,
      `После звонка: ${lead.full_name} (ID ${lead.id}) → статус: ${status}`
    );

    return lead;
  }

  @Get(':id/bonus')
  async getBonus(@Param('id') id: number) {
    return this.leadService.getLeadBonuses(id);
  }
}