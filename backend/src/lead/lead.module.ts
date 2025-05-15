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

@Module({
  imports: [
    TypeOrmModule.forFeature([Lead, ManagerBonus, OwnerBonus, User,]),
    AuditLogModule,
    BonusModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
