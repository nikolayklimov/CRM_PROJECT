import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne, 
  JoinColumn,
} from 'typeorm';
import { Stage } from '../stage/stage.entity';
import { User } from '../user/user.entity';

@Entity()
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  full_name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true })
  zipcode: string;

  @Column({ nullable: true })
  ssn: string;

  @Column({ nullable: true, type: 'date' })
  birth_date: Date;

  @CreateDateColumn({ type: 'timestamp' })
  lead_date: Date;

  @Column({ nullable: true })
  telegram: string;

  @Column({ nullable: true })
  priority: 'hot' | 'warm' | 'cold';

  @Column({ nullable: true })
  source: string;

  @Column({ nullable: true })
  source_subid: string;

  @OneToMany(() => Stage, (stage) => stage.lead, { cascade: true })
  stages: Stage[];

  @Column({
    type: 'enum',
    enum: ['new', 'in_work', 'callback', 'cut', 'to_level2', 'to_level3', 'closed'],
    default: 'new',
  })
  status: 'new' | 'in_work' | 'callback' | 'cut' | 'to_level2' | 'to_level3' | 'closed';

  @Column({ nullable: true, type: 'int' })
  assigned_to: number | null; // ID менеджера, если назначен

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_to' })
  assignedManager?: User;

  @Column({ type: 'int', default: 1 })
  visible_to_level: number; // 1, 2, 3

  @Column({ type: 'float', nullable: true })
  profit: number;

  @Column({ type: 'int', nullable: true })
  manager1Id: number;

  @Column({ type: 'int', nullable: true })
  manager2Id: number;

  @Column({ type: 'int', nullable: true })
  manager3Id: number;

  @Column({ type: 'int', nullable: true })
  call_center: number;

  @Column({ type: 'enum', enum: ['success', 'fail'], nullable: true })
  result_status: 'success' | 'fail';
}