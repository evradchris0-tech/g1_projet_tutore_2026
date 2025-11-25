// batiment.entity.ts
import { Espace } from 'src/espace/espace.entity';
import { Etage } from 'src/etage/etage.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Coordonnees } from './coordonnees/coordonnees.entity';

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

  @OneToMany(() => Etage, (e) => e.batiment)
  etages: Etage[];

  @CreateDateColumn()
  dateCreation: Date;

  @UpdateDateColumn()
  dateModification: Date;

  supprimerEtage(numeroEtage: number): boolean {
    if (!this.etages) return false;
    const idx = this.etages.findIndex((e) => e.numeroEtage === numeroEtage);
    if (idx === -1) return false;
    this.etages.splice(idx, 1);
    this.nombreEtage = this.etages.length;
    return true;
  }


obtenirEtages(): Etage[] {
return this.etages || [];
}


obtenirEspaces(): Espace[] {
const espaces: Espace[] = [];
(this.etages || []).forEach((e) => {
(e.espaces || []).forEach((s) => espaces.push(s));
});
return espaces;
}


obtenirNombreEquipements(): number {
// Equipement entity not implemented here; sum a placeholder
return this.obtenirEspaces().reduce((acc, esp) => acc + (esp.obtenirEquipements ? esp.obtenirEquipements().length : 0), 0);
}


verifierDisponibiliteCode(code: string): boolean {
return this.code !== code; // placeholder — real check should be in repository (unique constraint)
}

// Utility methods (not persisted)
calculerDistance(autres: Coordonnees): number {
// Haversine formula approximate (returns meters). Keep simple here.
if (!this.coordonnees.latitude || !this.coordonnees.longitude || !autres.latitude || !autres.longitude) return NaN;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const R = 6371000; // Earth radius meters
const dLat = toRad(autres.latitude - this.coordonnees.latitude);
const dLon = toRad(autres.longitude - this.coordonnees.longitude);
const a =
Math.sin(dLat / 2) * Math.sin(dLat / 2) +
Math.cos(toRad(this.coordonnees.latitude)) * Math.cos(toRad(autres.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c;
}


valider(): boolean {
if (this.coordonnees.latitude == null || this.coordonnees.longitude == null) return false;
return this.coordonnees.latitude >= -90 && this.coordonnees.latitude <= 90 && this.coordonnees.longitude >= -180 && this.coordonnees.longitude <= 180;
}
}
