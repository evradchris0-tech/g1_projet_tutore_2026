import { Test, TestingModule } from '@nestjs/testing';
import { AdminsController } from './admin.controller';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('AdminsController', () => {
  let controller: AdminsController;

  const mockHttpService = {
    post: jest.fn(() => of({ data: {} })),
    get: jest.fn(() => of({ data: {} })),
    patch: jest.fn(() => of({ data: {} })),
    delete: jest.fn(() => of({ data: {} })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminsController],
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<AdminsController>(AdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});