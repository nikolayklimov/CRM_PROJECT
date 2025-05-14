import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from './stage.entity';
import { StageService } from './stage.service';
import { StageController } from './stage.controller';
import { Lead } from '../lead/lead.entity';
import { User } from '../user/user.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Stage, Lead, User]),
    AuditLogModule,
],
  providers: [StageService],
  controllers: [StageController],
  exports: [StageService],
})
export class StageModule {}