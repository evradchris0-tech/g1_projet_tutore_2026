import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

describe('AuthController', () => {
  let controller: AuthController;

  const mockHttpService = {
    post: jest.fn(() => of({ data: {} })),
  };
////PB de connectio je met un faux commentaire pour commit vrai cde vrai c'est le 2eme commit ! 3eme !!!!!!
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});