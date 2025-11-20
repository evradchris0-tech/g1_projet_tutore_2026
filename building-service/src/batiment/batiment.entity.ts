// batiment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TypeBatiment {
  PEDAGOGIQUE = 'PEDAGOGIQUE',
  ADMINISTRATIF = 'ADMINISTRATIF',
  CITE_UNIVERSITAIRE = 'CITE_UNIVERSITAIRE',
  RESIDENCE_PERSONNEL = 'RESIDENCE_PERSONNEL',
  MIXTE = 'MIXTE',
}

@Entity('batiments')
export class Batiment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nom: string;

  @Column({ unique: true })
  code: string;

  @Column({ type: 'enum', enum: TypeBatiment })
  typeBatiment: TypeBatiment;

  @Column()
  adresse: string;

  @Column({ type: 'int', default: 0 })
  nombreEtage: number;

  @Column({ type: 'float', nullable: true })
  superficie: number;

  @Column({ type: 'timestamp', nullable: true })
  dateConstruction: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  planBatiment: string;

  @Column('jsonb', { nullable: true })
  coordonnees: {
    latitude: number;
    longitude: number;
    altitude: number;
  };

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;
}
