import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatimentService } from './batiment.service';
import { BatimentController } from './batiment.controller';
import { Batiment } from './batiment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Batiment])],
  providers: [BatimentService],
  controllers: [BatimentController],
  exports: [BatimentService],
})
export class BatimentModule {}
