import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Stage } from '../stage/stage.entity';
import { ManagerBonus } from '../bonus/manager-bonus.entity';
import { OwnerBonus } from '../bonus/owner-bonus.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
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

  @OneToMany(() => OwnerBonus, (bonus) => bonus.owner)
  ownerBonuses: OwnerBonus[];

  @Column({ nullable: true })
  managerLevel?: number; // 1, 2 или 3 — если пользователь менеджер
}