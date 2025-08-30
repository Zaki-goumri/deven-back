import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, HttpHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { createMock } from '@golevelup/ts-jest';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: createMock(),
        },
        {
          provide: HttpHealthIndicator,
          useValue: createMock(),
        },
        {
          provide: DiskHealthIndicator,
          useValue: createMock(),
        },
        {
          provide: MemoryHealthIndicator,
          useValue: createMock(),
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: createMock(),
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});