import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { BonusModule } from '../bonus/bonus.module';
import { Bonus } from '../bonus/bonus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, Bonus]),
    AuditLogModule,
    BonusModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
