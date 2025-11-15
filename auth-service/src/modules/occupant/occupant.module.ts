import { Module } from '@nestjs/common';
import { OccupantService } from './occupant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Occupant } from './occupant.entity';
import { OccupantController } from './occupant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Occupant])],
  controllers: [OccupantController],
  providers: [OccupantService],
})
export class OccupantModule {}
