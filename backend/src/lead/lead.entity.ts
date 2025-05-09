import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true, type: 'text' })
  notes: string;
}