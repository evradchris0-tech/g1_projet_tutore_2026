import { Test, TestingModule } from '@nestjs/testing';
import { OccupantsController } from './occupant.controller';

describe('OccupantController', () => {
  let controller: OccupantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccupantsController],
    }).compile();

    controller = module.get<OccupantsController>(OccupantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
