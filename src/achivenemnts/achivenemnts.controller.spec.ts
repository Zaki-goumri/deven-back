import { Test, TestingModule } from '@nestjs/testing';
import { AchivenemntsController } from './achivenemnts.controller';
import { AchivenemntsService } from './achivenemnts.service';
import { createMock } from '@golevelup/ts-jest';

describe('AchivenemntsController', () => {
  let controller: AchivenemntsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchivenemntsController],
      providers: [
        {
          provide: AchivenemntsService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<AchivenemntsController>(AchivenemntsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
