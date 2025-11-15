import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('UserController', () => {
  let controller: UserController;

  const mockHttpService = {
    post: jest.fn(() => of({ data: {} })),
    get: jest.fn(() => of({ data: {} })),
    patch: jest.fn(() => of({ data: {} })),
    delete: jest.fn(() => of({ data: {} })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});