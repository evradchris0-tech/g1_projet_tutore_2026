import { Test, TestingModule } from '@nestjs/testing';
import { EtageService } from './etage.service';

describe('EtageService', () => {
  let service: EtageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EtageService],
    }).compile();

    service = module.get<EtageService>(EtageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
