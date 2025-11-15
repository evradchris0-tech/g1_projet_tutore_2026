import { Test, TestingModule } from '@nestjs/testing';
import { OccupantService } from './occupant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Occupant } from './occupant.entity';

describe('OccupantService', () => {
  let service: OccupantService;

  const mockOccupantRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OccupantService,
        {
          provide: getRepositoryToken(Occupant),
          useValue: mockOccupantRepository,
        },
      ],
    }).compile();

    service = module.get<OccupantService>(OccupantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});