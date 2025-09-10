import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from '../entities/team.entity';
import { RedisService } from 'src/redis/redis.service';
import { createMock } from '@golevelup/ts-jest';

describe('TeamService', () => {
  let service: TeamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: createMock(),
        },
        {
          provide: RedisService,
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
