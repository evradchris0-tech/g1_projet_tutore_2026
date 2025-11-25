import { Batiment } from "src/batiment/batiment.entity";
import { Espace } from "src/espace/espace.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('etages')
export class Etage {
@PrimaryGeneratedColumn('uuid')
idEtage: string;


@ManyToOne(() => Batiment, (b) => b.etages, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'idBatiment' })
batiment: Batiment;


@Column()
idBatimentRef: string; // redundant but convenient in some queries


@Column('int')
numeroEtage: number;


@Column()
designation: string;


@Column('float', { nullable: true })
superficie?: number;


@Column('int', { default: 0 })
nombreEspaces: number;


@Column({ nullable: true })
planEtage?: string;


@CreateDateColumn()
dateCreation: Date;


@OneToMany(() => Espace, (esp) => esp.etage, { cascade: true })
espaces: Espace[];


ajouterEspace(espace: Espace): Espace {
if (!this.espaces) this.espaces = [];
this.espaces.push(espace);
this.nombreEspaces = this.espaces.length;
return espace;
}


supprimerEspace(idEspace: string): boolean {
if (!this.espaces) return false;
const idx = this.espaces.findIndex((e) => e.idEspace === idEspace);
if (idx === -1) return false;
this.espaces.splice(idx, 1);
this.nombreEspaces = this.espaces.length;
return true;
}


obtenirEspaces(): Espace[] {
return this.espaces || [];
}
}