import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

import { UserModule } from './user/user.module';
import { LeadModule } from './lead/lead.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // подключение базы
    UserModule, // модуль пользователей
    LeadModule, // модуль лидов
    AuthModule, // модуль аутентификации
    // сюда будут добавляться StageModule, BonusModule и др.
  ],
})
export class AppModule {}