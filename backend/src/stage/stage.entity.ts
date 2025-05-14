// 📌 Пояснения:
// StageType — определяет, какой это этап: 1, 2 или 3
// status — текущий статус (в процессе, завершён и т.д.)
// started_at / finished_at — даты
// duration_seconds — длительность этапа
// manager — кто обрабатывал
// lead — к какому лиду относится

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Lead } from '../lead/lead.entity';
import { User } from '../user/user.entity';

export enum StageType {
  STAGE_1 = 'stage_1',
  STAGE_2 = 'stage_2',
  STAGE_3 = 'stage_3',
}

export enum StageStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
}

@Entity()
export class Stage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: StageType,
  })
  type: StageType;

  @ManyToOne(() => Lead, (lead) => lead.stages, { onDelete: 'CASCADE' })
  lead: Lead;

	@ManyToOne(() => User, (user) => user.stages)
	manager: User;

  @Column({ type: 'enum', enum: StageStatus, default: StageStatus.ACTIVE })
  status: StageStatus;

  @CreateDateColumn()
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  finished_at: Date;

  @Column({ type: 'int', nullable: true }) // в секундах
  duration_seconds: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}

