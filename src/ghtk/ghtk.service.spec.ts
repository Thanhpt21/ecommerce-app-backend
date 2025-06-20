import { Test, TestingModule } from '@nestjs/testing';
import { GhtkService } from './ghtk.service';

describe('GhtkService', () => {
  let service: GhtkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GhtkService],
    }).compile();

    service = module.get<GhtkService>(GhtkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
