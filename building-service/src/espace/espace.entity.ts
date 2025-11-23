import { Equipement } from "../equipement/equipement.entity";
import { Etage } from "../etage/etage.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TypeEspace {
CHAMBRE_SIMPLE = 'CHAMBRE_SIMPLE',
CHAMBRE_DOUBLE = 'CHAMBRE_DOUBLE',
CHAMBRE_TRIPLE = 'CHAMBRE_TRIPLE',
SALLE_CLASSE = 'SALLE_CLASSE',
AMPHITHEATRE = 'AMPHITHEATRE',
BUREAU_INDIVIDUEL = 'BUREAU_INDIVIDUEL',
BUREAU_PARTAGE = 'BUREAU_PARTAGE',
LABORATOIRE = 'LABORATOIRE',
SALLE_REUNION = 'SALLE_REUNION',
AUTRE = 'AUTRE',
}

@Entity('espaces')
export class Espace {
@PrimaryGeneratedColumn('uuid')
idEspace: string;


@ManyToOne(() => Etage, (et) => et.espaces, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'idEtage' })
etage: Etage;


@Column()
idEtageRef: string;


@Column()
numero: string;


@Column({ type: 'enum', enum: TypeEspace })
typeEspace: TypeEspace;


@Column('float', { nullable: true })
superficie?: number;


@Column('int', { nullable: true })
capaciteOccupation?: number;


@Column({ type: 'text', nullable: true })
description?: string;


@Column({ default: false })
estOccupe: boolean;


@Column({ default: false })
aEquipementDefectueux: boolean;


@CreateDateColumn()
dateCreation: Date;


@UpdateDateColumn()
dateModification: Date;

@OneToMany(() => Equipement, (e) => e.espaceActuel)
equipements: Equipement[];


// Relations to Equipement, Incident, Occupant are TODO and must be created in your domain


// Domain methods
assignerEquipement(equipement: Equipement): boolean {
// Implement when Equipement entity exists; placeholder
return true;
}


retirerEquipement(idEquipement: string): boolean {
return true;
}


obtenirEquipements(): Equipement[] {
    return [];
}


verifierEquipementsDefectueux(): boolean {
// Placeholder: update flag based on related equipment statuses
this.aEquipementDefectueux = false;
return this.aEquipementDefectueux;
}


obtenirLocalisation(): string {
const bat = this.etage?.batiment?.nom || 'N/A';
const étage = this.etage?.designation || 'N/A';
return `${bat} / ${étage} / ${this.numero}`;
}
}