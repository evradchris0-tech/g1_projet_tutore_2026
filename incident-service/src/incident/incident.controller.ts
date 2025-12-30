import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    ParseUUIDPipe,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { AddCommentaireDto } from './dto/add-commentaire.dto';
import { ChangeStatutDto } from './dto/change-statut.dto';

@Controller('incidents')
export class IncidentController {
    constructor(private readonly incidentService: IncidentService) {}

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    create(@Body() dto: CreateIncidentDto) {
        return this.incidentService.create(dto);
    }

    @Get()
    findAll() {
        return this.incidentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.incidentService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateIncidentDto,
    ) {
        return this.incidentService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.incidentService.remove(id);
    }

    @Post(':id/commentaires')
    addCommentaire(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: AddCommentaireDto,
    ) {
        return this.incidentService.addCommentaire(id, dto);
    }

    @Post(':id/statut')
    changerStatut(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: ChangeStatutDto,
    ) {
        return this.incidentService.changerStatut(id, dto);
    }
}
