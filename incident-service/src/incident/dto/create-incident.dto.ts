import {
    IsString,
    IsEnum,
    IsOptional,
    IsArray,
    IsNotEmpty
} from 'class-validator';

import { PrioriteIncident } from '../enums/priorite-incident.enum';
import { StatutIncident } from '../enums/statut-incident.enum';
import { TypeDeclarant } from '../enums/type-declarant.enum';

export class CreateIncidentDto {
    @IsString()
    @IsNotEmpty()
    idEquipement: string;

    @IsString()
    @IsNotEmpty()
    idEspace: string;

    @IsString()
    @IsNotEmpty()
    idDeclarant: string;

    @IsEnum(TypeDeclarant)
    typeDeclarant: TypeDeclarant;

    @IsEnum(PrioriteIncident)
    priorite: PrioriteIncident;

    @IsString()
    titre: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsArray()
    photos?: string[];
}
