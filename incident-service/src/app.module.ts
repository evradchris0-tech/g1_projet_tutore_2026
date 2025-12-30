import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {IncidentModule} from "./incident/incident.module";


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({ // ou forRootAsync si tu utilises ConfigService
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5433,
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASS || 'admin',
      database: process.env.DB_NAME || 'incidentdb',
      autoLoadEntities: true,
      synchronize: true, // désactiver en prod
    }),
    IncidentModule,
  ],
})
export class AppModule {}
