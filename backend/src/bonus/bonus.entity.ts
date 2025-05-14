import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';

@Entity()
export class Bonus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  manager: User;

  @ManyToOne(() => Lead, { eager: true })
  lead: Lead;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'float' })
  percent: number;

  @CreateDateColumn()
  created_at: Date;
}