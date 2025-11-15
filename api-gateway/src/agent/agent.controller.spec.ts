import { Test, TestingModule } from '@nestjs/testing';
import { AgentsController } from './agent.controller';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('AgentController', () => {
  let controller: AgentsController;

  const mockHttpService = {
    post: jest.fn(() => of({ data: {} })),
    get: jest.fn(() => of({ data: {} })),
    patch: jest.fn(() => of({ data: {} })),
    delete: jest.fn(() => of({ data: {} })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentsController],
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<AgentsController>(AgentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});