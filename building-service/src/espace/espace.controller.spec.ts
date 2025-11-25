import { Test, TestingModule } from '@nestjs/testing';
import { EspaceController } from './espace.controller';

describe('EspaceController', () => {
  let controller: EspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspaceController],
    }).compile();

    controller = module.get<EspaceController>(EspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
