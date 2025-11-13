import { Test, TestingModule } from '@nestjs/testing';
import { OccupantService } from './occupant.service';

describe('OccupantService', () => {
  let service: OccupantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccupantService],
    }).compile();

    service = module.get<OccupantService>(OccupantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
