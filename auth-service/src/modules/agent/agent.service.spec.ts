import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from './agent.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agent } from './agent.entity';

describe('AgentService', () => {
  let service: AgentService;

  const mockAgentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: getRepositoryToken(Agent),
          useValue: mockAgentRepository,
        },
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
