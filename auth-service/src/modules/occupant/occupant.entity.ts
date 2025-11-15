import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('occupants')
export class Occupant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numeroChambre: string;

  @Column()
  tempPassword: string;

  @OneToOne(() => User, (user) => user.occupant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
