/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/userInfo.entity';
import { Location } from 'src/common/entities/location.entity';
import { ConfigService } from '@nestjs/config';
import { createMock } from '@golevelup/ts-jest';
import {
  createMockRepository,
  MockRepository,
} from 'src/common/utils/database/repos-mock.utils';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';

describe('UserService', () => {
  let service: UserService;
  let userRepo: MockRepository<User>;
  let userInfoRepo: MockRepository<UserInfo>;
  let locationRepo: MockRepository<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository<User>(),
        },
        {
          provide: getRepositoryToken(UserInfo),
          useValue: createMockRepository<UserInfo>(),
        },
        {
          provide: getRepositoryToken(Location),
          useValue: createMockRepository<Location>(),
        },
        {
          provide: ConfigService,
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepo = module.get(getRepositoryToken(User));
    userInfoRepo = module.get(getRepositoryToken(UserInfo));
    locationRepo = module.get(getRepositoryToken(Location));
  });

  describe('create User', () => {
    it('should create user from the dto', async () => {
      const dto: registerDto = {
        email: 'test@test.com',
        password: 'test1234',
        username: 'testuser',
        confirmPassword: 'test1234',
      };

      const createdAt = new Date();
      const updatedAt = new Date();
      const hashedPassword = `hashedPassword${dto.password}`;
      userRepo.create?.mockReturnValue({
        email: dto.email,
        isEmailVerified: false,
        password: hashedPassword,
        username: dto.username,
      } as User);
      userRepo.save?.mockResolvedValue({
        id: 1,
        email: dto.email,
        isEmailVerified: false,
        password: hashedPassword,
        username: dto.username,
        createdAt,
        updatedAt,
      } as User);
      const user = await service.createUser(dto);

           expect(user).toEqual({
        id: 1,
        email: dto.email,
        password: hashedPassword,
        username: dto.username,
        isEmailVerified: false,
        createdAt,
        updatedAt,
      } as User);
    });
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
