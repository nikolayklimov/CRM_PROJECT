import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Stage } from '../stage/stage.entity';
import { ManagerBonus } from '../bonus/manager-bonus.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'manager', 'senior', 'owner', 'supervisor'],
    default: 'manager',
  })
  role: 'admin' | 'manager' | 'senior' | 'owner' | 'supervisor';

  @OneToMany(() => Stage, (stage) => stage.manager)
  stages: Stage[];

  @OneToMany(() => ManagerBonus, (bonus) => bonus.manager)
  bonuses: ManagerBonus[];
}