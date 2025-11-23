import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BatimentController } from './batiment/batiment.controller';
import { BatimentService } from './batiment/batiment.service';
import { BatimentModule } from './batiment/batiment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EtageController } from './etage/etage.controller';
import { EspaceController } from './espace/espace.controller';
import { EspaceService } from './espace/espace.service';
import { EtageService } from './etage/etage.service';
import { EspaceModule } from './espace/espace.module';
import { EtageModule } from './etage/etage.module';
import { EquipementService } from './equipement/equipement.service';
import { EquipementController } from './equipement/equipement.controller';
import { EquipementModule } from './equipement/equipement.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),BatimentModule, EspaceModule, EtageModule, EquipementModule],
  controllers: [AppController, EtageController, EspaceController, EquipementController],
  providers: [AppService, EspaceService, EtageService, EquipementService],
})
export class AppModule {}
