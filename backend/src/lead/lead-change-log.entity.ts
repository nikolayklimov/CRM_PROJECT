import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Lead } from './lead.entity';
import { User } from '../user/user.entity';

@Entity()
export class LeadChangeLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lead, { onDelete: 'CASCADE' })
  lead: Lead;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  manager: User;

  @Column()
  field: string;

  @Column({ type: 'text', nullable: true })
  oldValue: string;

  @Column({ type: 'text', nullable: true })
  newValue: string;

  @CreateDateColumn()
  createdAt: Date;
}