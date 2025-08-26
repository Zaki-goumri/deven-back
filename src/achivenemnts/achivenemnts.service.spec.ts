import { Test, TestingModule } from '@nestjs/testing';
import { AchivenemntsService } from './achivenemnts.service';

describe('AchivenemntsService', () => {
  let service: AchivenemntsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AchivenemntsService],
    }).compile();

    service = module.get<AchivenemntsService>(AchivenemntsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
