import { Test, TestingModule } from '@nestjs/testing';
import { EtageController } from './etage.controller';

describe('EtageController', () => {
  let controller: EtageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EtageController],
    }).compile();

    controller = module.get<EtageController>(EtageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
