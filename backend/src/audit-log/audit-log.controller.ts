import {
  Controller,
  Get,
  Query,
  Header,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';

@Controller('audit')
export class AuditLogController {
  constructor(private readonly auditService: AuditLogService) {}

  @Get()
  async getLogs(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('actionType') actionType?: string,
  ) {
    return this.auditService.getLogs({ from, to, actionType });
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="audit_logs.csv"')
  async exportLogs(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('actionType') actionType?: string,
  ): Promise<string> {
    return this.auditService.exportLogsToCSV({ from, to, actionType });
  }
}
