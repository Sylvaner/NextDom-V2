import { Test, TestingModule } from '@nestjs/testing';
import { LightController } from './light.controller';

describe('LightController', () => {
  let controller: LightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LightController],
    }).compile();

    controller = module.get<LightController>(LightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
