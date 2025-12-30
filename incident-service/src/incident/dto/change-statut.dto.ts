import { IsEnum, IsString, IsOptional } from 'class-validator';
import { StatutIncident } from '../enums/statut-incident.enum';

export class ChangeStatutDto {
    @IsEnum(StatutIncident)
    nouveauStatut: StatutIncident;

    @IsString()
    idUtilisateur: string;

    @IsOptional()
    @IsString()
    motif?: string;

    @IsOptional()
    @IsString()
    idAgentResponsable?: string;
}
