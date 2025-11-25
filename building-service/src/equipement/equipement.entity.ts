import { Espace } from "src/espace/espace.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TypeEquipement {
LIT = 'LIT',
TABLE = 'TABLE',
CHAISE = 'CHAISE',
ARMOIRE = 'ARMOIRE',
CLIMATISEUR = 'CLIMATISEUR',
REFRIGERATEUR = 'REFRIGERATEUR',
TELEVISEUR = 'TELEVISEUR',
BUREAU = 'BUREAU',
ETAGERE = 'ETAGERE',
LAVABO = 'LAVABO',
WC = 'WC',
DOUCHE = 'DOUCHE',
PORTE = 'PORTE',
FENETRE = 'FENETRE',
PRISE_ELECTRIQUE = 'PRISE_ELECTRIQUE',
LAMPE = 'LAMPE',
TABLEAU_BLANC = 'TABLEAU_BLANC',
PROJECTEUR = 'PROJECTEUR',
AUTRE = 'AUTRE',
}


export enum StatutEquipement {
BON_ETAT = 'BON_ETAT',
A_REPARER = 'A_REPARER',
A_REMPLACER = 'A_REMPLACER',
EN_MAINTENANCE = 'EN_MAINTENANCE',
HORS_SERVICE = 'HORS_SERVICE',
EN_ATTENTE_PIECE = 'EN_ATTENTE_PIECE',
}


/* --------------------------- EQUIPEMENT ENTITY --------------------------- */
@Entity('equipements')
export class Equipement {
@PrimaryGeneratedColumn('uuid')
idEquipement: string;


@Column({ type: 'enum', enum: TypeEquipement })
typeEquipement: TypeEquipement;


@Column({ nullable: true })
marque?: string;


@Column({ nullable: true })
modele?: string;


@Column({ unique: true, nullable: true })
numeroSerie?: string;


@Column({ type: 'enum', enum: StatutEquipement })
statut: StatutEquipement;


@ManyToOne(() => Espace, (e) => e.equipements, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'idEspaceActuel' })
espaceActuel?: Espace;
}