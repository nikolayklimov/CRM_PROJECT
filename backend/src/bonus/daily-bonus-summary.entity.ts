import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
@Unique(['user', 'date']) // один пользователь — одна строка в день
export class DailyBonusSummary {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'int', nullable: true })
  callCenter: number;

  @Column({ type: 'int', nullable: true })
  managerLevel: number | null;

  @Column({ type: 'float', default: 0 })
  totalBonus: number;

  @Column({ type: 'date' })
  date: string;
}