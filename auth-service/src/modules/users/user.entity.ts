import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, OneToOne } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Agent } from '../agent/agent.entity';
import { Occupant } from '../occupant/occupant.entity';

export enum UserRole {
  ADMIN = 'ADMIN',
  AGENT = 'AGENT',
  OCCUPANT = 'OCCUPANT',
  SUPERVISEUR = 'SUPERVISEUR',
}


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index() // Optimise login
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.OCCUPANT })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Admin, (admin) => admin.user)
  admin?: Admin;

  @OneToOne(() => Agent, (agent) => agent.user)
  agent?: Agent;

  @OneToOne(() => Occupant, (occupant) => occupant.user)
  occupant?: Occupant;

}
