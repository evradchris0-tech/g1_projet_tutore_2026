import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum AccessLevel {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}


@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  phone: string;

  @Column({ type: 'enum', enum: AccessLevel, default: AccessLevel.ADMIN })
  access : AccessLevel;

  @OneToOne(() => User, (user) => user.admin, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
