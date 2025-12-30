import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';

import { Incident } from './incident.entity';

@Entity()
export class Commentaire {
    @PrimaryGeneratedColumn('uuid')
    idCommentaire: string;

    @Column()
    idAuteur: string; // user-service

    @Column({ type: 'text' })
    contenu: string;

    @CreateDateColumn()
    dateCreation: Date;

    @Column({ nullable: true })
    pieceJointe?: string;

    @ManyToOne(() => Incident, (incident) => incident.commentaires, {
        onDelete: 'CASCADE',
    })
    incident: Incident;
}
