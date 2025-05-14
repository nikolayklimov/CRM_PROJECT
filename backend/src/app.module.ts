import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

import { UserModule } from './user/user.module';
import { LeadModule } from './lead/lead.module';
import { AuthModule } from './auth/auth.module';
import { StageModule } from './stage/stage.module';
import { CallController } from './call/call.controller';
import { AuditLogModule } from './audit-log/audit-log.module';
import { BonusModule } from './bonus/bonus.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // подключение базы
    UserModule, // модуль пользователей
    LeadModule, // модуль лидов
    AuthModule, // модуль аутентификации
    StageModule, 
    AuditLogModule,
    BonusModule,
    // сюда будут добавляться StageModule, BonusModule и др.
  ],
  controllers: [CallController],
})
export class AppModule {}