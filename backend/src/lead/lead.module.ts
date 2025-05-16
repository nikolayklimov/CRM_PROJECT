import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { AuditLogModule } from '../audit-log/audit-log.module';
import { BonusModule } from '../bonus/bonus.module';
import { User } from '../user/user.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { LeadNote } from './lead-note/lead-note.entity';
import { LeadChangeLog } from './lead-change-log.entity';
import { DailyBonusSummary } from '../bonus/daily-bonus-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      ManagerBonus,
      OwnerBonus,
      User,
      LeadNote,
      LeadChangeLog,
      DailyBonusSummary,
    ]),
    AuditLogModule,
    BonusModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
