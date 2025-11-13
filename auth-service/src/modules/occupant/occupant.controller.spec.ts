import { Test, TestingModule } from '@nestjs/testing';
import { OccupantController } from './occupant.controller';

describe('OccupantController', () => {
  let controller: OccupantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccupantController],
    }).compile();

    controller = module.get<OccupantController>(OccupantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
