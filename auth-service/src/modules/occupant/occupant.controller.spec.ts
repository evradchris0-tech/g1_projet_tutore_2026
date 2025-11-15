import { Test, TestingModule } from '@nestjs/testing';
import { OccupantController } from './occupant.controller';
import { OccupantService } from './occupant.service';

describe('OccupantController', () => {
  let controller: OccupantController;

  const mockOccupantService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccupantController],
      providers: [
        {
          provide: OccupantService,
          useValue: mockOccupantService,
        },
      ],
    }).compile();

    controller = module.get<OccupantController>(OccupantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});