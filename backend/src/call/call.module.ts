import { Module } from '@nestjs/common';
import { CallController } from './call.controller';
import { StageService } from '../stage/stage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stage } from '../stage/stage.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stage]), AuditLogModule],
  controllers: [CallController],
  providers: [StageService], // мы не создаём отдельный CallService, а используем StageService
})
export class CallModule {}