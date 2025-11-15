import { Test, TestingModule } from '@nestjs/testing';
import { OccupantsController } from './occupant.controller';
import { HttpModule } from '@nestjs/axios'; // <-- importer HttpModule

describe('OccupantController', () => {
  let controller: OccupantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule], // <-- ajouter ici
      controllers: [OccupantsController],
    }).compile();

    controller = module.get<OccupantsController>(OccupantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
