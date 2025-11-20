import { Column } from 'typeorm';

export class Coordonnees {
  @Column('double precision', { nullable: true })
  latitude?: number;

  @Column('double precision', { nullable: true })
  longitude?: number;

  @Column('double precision', { nullable: true })
  altitude?: number;
}
