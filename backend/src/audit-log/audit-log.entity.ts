import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  method: string;

  @Column()
  route: string;

  @Column({ type: 'json', nullable: true })
  payload: any;

  @Column({ nullable: true })
  actionType: string; // тип действия, например "lead_created"

  @Column({ nullable: true })
  entityId: string; // ID лида, этапа и т.д.

  @Column({ nullable: true })
  summary: string; // описание в свободной форме

  @CreateDateColumn()
  createdAt: Date;
}