import { Test, TestingModule } from '@nestjs/testing';
import { EspaceService } from './espace.service';

describe('EspaceService', () => {
  let service: EspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EspaceService],
    }).compile();

    service = module.get<EspaceService>(EspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
