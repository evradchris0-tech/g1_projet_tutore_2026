import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StatutIncident } from './enums/statut-incident.enum';
import { Incident } from './entities/incident.entity';
import { Commentaire } from './entities/commentaire.entity';
import { HistoriqueStatut } from './entities/historique-statut.entity';

import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { ChangeStatutDto } from './dto/change-statut.dto';
import {AddCommentaireDto} from "./dto/add-commentaire.dto";
import {PrioriteIncident} from "./enums/priorite-incident.enum";

@Injectable()
export class IncidentService {
    constructor(
        @InjectRepository(Incident)
        private incidentRepo: Repository<Incident>,

        @InjectRepository(Commentaire)
        private commentaireRepo: Repository<Commentaire>,

        @InjectRepository(HistoriqueStatut)
        private historiqueRepo: Repository<HistoriqueStatut>,
    ) {}

    // ---------------------------
    // CREATE
    // ---------------------------

    async create(dto: CreateIncidentDto): Promise<Incident> {
        const incident = this.incidentRepo.create({
            ...dto,
            statut:
                dto.priorite === PrioriteIncident.CRITIQUE
                    ? StatutIncident.PRISE_EN_CHARGE
                    : StatutIncident.EN_ATTENTE,
        });

        const savedIncident = await this.incidentRepo.save(incident);

        const historique = this.historiqueRepo.create({
            incident: savedIncident,
            ancienStatut: null,
            nouveauStatut: savedIncident.statut,
            idUtilisateur: dto.idDeclarant,
            motif: 'Création de l’incident',
        });

        await this.historiqueRepo.save(historique);

        return this.findOne(savedIncident.idIncident);
    }


    // ---------------------------
    // READ
    // ---------------------------

    async findAll(): Promise<Incident[]> {
        return this.incidentRepo.find({
            relations: ['commentaires', 'historiqueStatuts'],
        });
    }

    async findOne(id: string): Promise<Incident> {
        const incident = await this.incidentRepo.findOne({
            where: { idIncident: id },
            relations: ['commentaires', 'historiqueStatuts'],
        });

        if (!incident)
            throw new NotFoundException('Incident introuvable');

        return incident;
    }

    // ---------------------------
    // UPDATE
    // ---------------------------

    async update(id: string, dto: UpdateIncidentDto): Promise<Incident> {
        const incident = await this.findOne(id);

        Object.assign(incident, dto);

        return this.incidentRepo.save(incident);
    }

    // ---------------------------
    // DELETE
    // ---------------------------

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.incidentRepo.delete(id);
    }

    // ---------------------------
    // COMMENTAIRE
    // ---------------------------

    async addCommentaire(
        incidentId: string,
        dto: AddCommentaireDto,
    ): Promise<Commentaire> {
        const incident = await this.findOne(incidentId);

        const commentaire = this.commentaireRepo.create({
            ...dto,
            incident,
        });

        return this.commentaireRepo.save(commentaire);
    }

    // ---------------------------
    // CHANGER STATUT
    // ---------------------------

    async changerStatut(
        incidentId: string,
        dto: ChangeStatutDto,
    ): Promise<Incident> {
        const incident = await this.findOne(incidentId);

        // Historique
        const historique = this.historiqueRepo.create({
            incident,
            ancienStatut: incident.statut,
            nouveauStatut: dto.nouveauStatut,
            idUtilisateur: dto.idUtilisateur,
            motif: dto.motif,
        });

        await this.historiqueRepo.save(historique);

        // Mise à jour du statut
        incident.statut = dto.nouveauStatut;

        // Affectation de l'agent
        if (
            dto.idAgentResponsable &&
            [StatutIncident.PRISE_EN_CHARGE, StatutIncident.EN_COURS_TRAITEMENT].includes(
                dto.nouveauStatut,
            )
        ) {
            incident.idAgentResponsable = dto.idAgentResponsable;
        }

        return this.incidentRepo.save(incident);
    }
}
