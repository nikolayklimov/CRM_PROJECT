import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BonusController } from './bonus.controller';
import { BonusService } from './bonus.service';
import { ManagerBonus } from './manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerBonus, OwnerBonus])],
  controllers: [BonusController],
  providers: [BonusService],
  exports: [
    BonusService,
    TypeOrmModule,
  ],
})
export class BonusModule {}