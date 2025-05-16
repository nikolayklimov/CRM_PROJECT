import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Lead } from '../lead.entity';
import { User } from '../../user/user.entity';

@Entity()
export class LeadNote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lead, { onDelete: 'CASCADE' })
  lead: Lead;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  manager: User;

  @Column({ type: 'int', nullable: true })
  managerLevel: number;

  @Column({ type: 'int', nullable: true })
  callCenter: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date; 
}