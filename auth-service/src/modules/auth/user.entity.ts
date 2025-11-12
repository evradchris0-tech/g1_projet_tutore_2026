import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
}
