import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { getQueueToken } from '@nestjs/bullmq';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { createMock } from '@golevelup/ts-jest';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UserService,
          useValue: createMock(),
        },
        {
          provide: JwtService,
          useValue: createMock(),
        },
        {
          provide: ConfigService,
          useValue: createMock(),
        },
        {
          provide: RedisService,
          useValue: createMock(),
        },
        {
          provide: getQueueToken(QUEUE_NAME.MAIL),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});