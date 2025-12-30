import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
} from 'typeorm';

import { Incident } from './incident.entity';
import { StatutIncident } from '../enums/statut-incident.enum';

@Entity()
export class HistoriqueStatut {
    @PrimaryGeneratedColumn('uuid')
    idHistorique: string;

    @Column()
    idUtilisateur: string; // user-service

    @Column({ type: 'enum', enum: StatutIncident,nullable: true })
    ancienStatut: StatutIncident | null;

    @Column({ type: 'enum', enum: StatutIncident })
    nouveauStatut: StatutIncident;

    @Column({ nullable: true })
    motif: string;

    @CreateDateColumn()
    dateChangement: Date;

    @ManyToOne(() => Incident, (incident) => incident.historiqueStatuts, {
        onDelete: 'CASCADE',
    })
    incident: Incident;
}
