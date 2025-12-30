import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { TypeDeclarant } from '../enums/type-declarant.enum';
import { StatutIncident } from '../enums/statut-incident.enum';
import { PrioriteIncident } from '../enums/priorite-incident.enum';
import {Commentaire} from "./commentaire.entity";
import {HistoriqueStatut} from "./historique-statut.entity";


@Entity()
export class Incident {
    @PrimaryGeneratedColumn('uuid')
    idIncident: string;

    // Relations EXTERNES (IDs venant des autres microservices)
    @Column()
    idEquipement: string;

    @Column()
    idEspace: string;

    @Column()
    idDeclarant: string;

    @Column({ nullable: true })
    idAgentResponsable: string;

    // ENUMS
    @Column({ type: 'enum', enum: TypeDeclarant })
    typeDeclarant: TypeDeclarant;

    @Column({ type: 'enum', enum: StatutIncident })
    statut: StatutIncident;

    @Column({ type: 'enum', enum: PrioriteIncident })
    priorite: PrioriteIncident;

    // Informations
    @Column()
    titre: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // Photos sous forme de URLs
    @Column('text', { array: true, nullable: true })
    photos?: string[];

    @CreateDateColumn()
    dateCreation: Date;

    @UpdateDateColumn()
    dateModification: Date;

    // Relations internes
    @OneToMany(() => Commentaire, (c) => c.incident, { cascade: true })
    commentaires: Commentaire[];

    @OneToMany(() => HistoriqueStatut, (hs) => hs.incident, { cascade: true })
    historiqueStatuts: HistoriqueStatut[];
}
