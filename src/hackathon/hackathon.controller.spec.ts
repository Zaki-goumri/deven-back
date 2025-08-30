import { Test, TestingModule } from '@nestjs/testing';
import { HackathonController } from './hackathon.controller';
import { HackathonService } from './hackathon.service';
import { createMock } from '@golevelup/ts-jest';

describe('HackathonController', () => {
  let controller: HackathonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HackathonController],
      providers: [
        {
          provide: HackathonService,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<HackathonController>(HackathonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});