import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/userInfo.entity';
import { Location } from 'src/common/entities/location.entity';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock(),
        },
        {
          provide: getRepositoryToken(UserInfo),
          useValue: createMock(),
        },
        {
          provide: getRepositoryToken(Location),
          useValue: createMock(),
        },
        {
          provide: ConfigService,
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
