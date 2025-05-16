import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn
} from 'typeorm';
import { User } from '../user/user.entity';
import { Lead } from '../lead/lead.entity';

@Entity()
export class OwnerBonus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: number;

  @ManyToOne(() => Lead)
  lead: Lead;

  @Column({ type: 'float' })
  amount: number;

  @CreateDateColumn()
  created_at: Date;
}