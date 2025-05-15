import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';

@Entity()
export class OwnerBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  owner: User;

  @ManyToOne(() => Lead)
  lead: Lead;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  created_at: Date;
}