import { Test, TestingModule } from '@nestjs/testing';
import { OccupantsController } from './occupant.controller';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('OccupantController', () => {
  let controller: OccupantsController;

  const mockHttpService = {
    post: jest.fn(() => of({ data: {} })),
    get: jest.fn(() => of({ data: {} })),
    patch: jest.fn(() => of({ data: {} })),
    delete: jest.fn(() => of({ data: {} })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccupantsController],
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<OccupantsController>(OccupantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});