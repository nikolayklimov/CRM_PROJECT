import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';

@Entity('manager_bonus')
export class ManagerBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bonuses)
  manager: User;

  @ManyToOne(() => Lead)
  lead: Lead;

  @Column({ type: 'int' })
  percent: number;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  created_at: Date;
}