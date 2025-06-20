import { Test, TestingModule } from '@nestjs/testing';
import { GhtkController } from './ghtk.controller';

describe('GhtkController', () => {
  let controller: GhtkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GhtkController],
    }).compile();

    controller = module.get<GhtkController>(GhtkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
