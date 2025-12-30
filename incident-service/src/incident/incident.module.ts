import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Incident } from './entities/incident.entity';
import { Commentaire } from './entities/commentaire.entity';
import { HistoriqueStatut } from './entities/historique-statut.entity';

import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';

@Module({
    imports: [
        ConfigModule, // si tu veux lire des vars d'env dans ce module
        TypeOrmModule.forFeature([Incident, Commentaire, HistoriqueStatut]),
    ],
    controllers: [IncidentController],
    providers: [IncidentService],
    exports: [IncidentService], // exporté si d'autres modules doivent l'utiliser
})
export class IncidentModule {}
