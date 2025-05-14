import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';
import { Parser } from 'json2csv'; 

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async logAction(
    userId: number,
    method: string,
    route: string,
    payload: any,
    actionType?: string,
    entityId?: string | number,
    summary?: string,
  ) {
    const entry = this.auditRepo.create({
      userId,
      method,
      route,
      payload: JSON.stringify(payload),
      actionType,
      entityId: entityId?.toString(),
      summary,
    });

    await this.auditRepo.save(entry);
  }

  async getLogs(params: {
    from?: string;
    to?: string;
    actionType?: string;
  }) {
    const { from, to, actionType } = params;

    const query = this.auditRepo.createQueryBuilder('log');

    if (from) {
      query.andWhere('log.createdAt >= :from', { from });
    }

    if (to) {
      query.andWhere('log.createdAt <= :to', { to });
    }

    if (actionType) {
      query.andWhere('log.actionType = :actionType', { actionType });
    }

    query.orderBy('log.createdAt', 'DESC');

    return query.getMany();
  }

  async exportLogsToCSV(params: {
    from?: string;
    to?: string;
    actionType?: string;
  }): Promise<string> {
    const { from, to, actionType } = params;

    const query = this.auditRepo.createQueryBuilder('log');

    if (from) {
      query.andWhere('log.createdAt >= :from', { from });
    }

    if (to) {
      query.andWhere('log.createdAt <= :to', { to });
    }

    if (actionType) {
      query.andWhere('log.actionType = :actionType', { actionType });
    }

    query.orderBy('log.createdAt', 'DESC');

    const logs = await query.getMany();

    const parser = new Parser({
      fields: [
        'id',
        'userId',
        'method',
        'route',
        'payload',
        'actionType',
        'entityId',
        'summary',
        'createdAt',
      ],
    });

    return parser.parse(logs);
  }
}