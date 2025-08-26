import { Test, TestingModule } from '@nestjs/testing';
import { AchivenemntsController } from './achivenemnts.controller';
import { AchivenemntsService } from './achivenemnts.service';

describe('AchivenemntsController', () => {
  let controller: AchivenemntsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchivenemntsController],
      providers: [AchivenemntsService],
    }).compile();

    controller = module.get<AchivenemntsController>(AchivenemntsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
