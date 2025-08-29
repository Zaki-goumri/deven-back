import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { CreateTeamDto } from './dto/create-team.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { MoreThan, Repository } from 'typeorm';
import { RedisService } from 'src/redis/redis.service';
import {
  PaginationDtoRes,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { LOGGER_NAMES } from 'src/common/constants/logger';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  isPostgresError,
  PostgresErrorCode,
} from 'src/common/constants/db-code';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    private readonly redisService: RedisService,
  ) {}
  private logger = new Logger(LOGGER_NAMES.TEAM_SERVICE);

  static CACHE_PREFIX = 'team';

  private TEAM_CODE_LENGTH = 5;

  static getCacheKey(id: number) {
    return `${TeamService.CACHE_PREFIX}:${id}`;
  }

  async create(dto: CreateTeamDto, hackathonId: number, createdById: number) {
    const maxTries = 5;
    for (let i = 0; i < maxTries; i++) {
      try {
        const code = this.generateTeamCode();
        const team = this.teamRepo.create({
          ...dto,
          code,
          hackathonId,
          ownerId: createdById,
        });
        await this.teamRepo.save(team);
        this.logger.log(
          `team with id ${team.id} in hackathon with id ${hackathonId}`,
        );
        return {
          data: {
            ...team,
            success: true,
            message: `team is created successfully with id ${team.id}`,
          },
        };
      } catch (err: any) {
        if (isPostgresError(err)) {
          switch (err.code) {
            case PostgresErrorCode.UNIQUE_VIOLATION:
              continue; // retry with new code
            case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
              throw new NotFoundException('Hackathon not found');
            default:
              throw err;
          }
        }
      }
    }
    throw new ConflictException(
      'Could not generate a unique team code after several tries',
    );
  }

  async getOne(id: number) {
    const cachedTeam = await this.redisService.get<Team>(
      TeamService.getCacheKey(id),
    );
    if (cachedTeam) return cachedTeam;
    const teamFromDb = await this.teamRepo.findOne({ where: { id } });
    if (!teamFromDb) throw new NotFoundException(`team with ${id} in db`);
    await this.redisService.set(
      TeamService.getCacheKey(teamFromDb.id),
      teamFromDb,
    );
    return { data: { ...teamFromDb }, success: true };
  }
  async getMany(
    { take = 10, lastId = 0 }: PaginationQueryDto,
    hackathonId: number,
  ) {
    const [teams] = await this.teamRepo.findAndCount({
      where: {
        id: MoreThan(lastId),
        hackathonId,
      },
      take: take + 1,
      order: { id: 'ASC' },
    });
    const hasMore = teams.length === take;
    const newLastId = teams.length > 0 ? teams[teams.length - 1].id : lastId;
    return new PaginationDtoRes(teams, take, newLastId, hasMore);
  }

  async update(dto: UpdateTeamDto, id: number) {
    const result = await this.teamRepo
      .createQueryBuilder()
      .update()
      .set(dto)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    // If no rows were updated, the team does not exist
    if (!result.affected) {
      throw new NotFoundException(`Team with id ${id} not found`);
    }
    await this.redisService.del(TeamService.getCacheKey(id));
    const updatedTeam = Array.isArray(result.raw)
      ? (result.raw[0] as Team)
      : null;

    return {
      data: { ...updatedTeam },
      success: true,
      message: `Team with id ${id} updated succesfully`,
    };
  }
  async remove(id: number, userId: number) {
    const { affected } = await this.teamRepo.delete({ id, ownerId: userId });
    if (!affected)
      throw new UnauthorizedException(
        `you not authorized to delete team with id ${id}`,
      );
    return {
      success: true,
      message: `team with id ${id} is removed successfully`,
    };
  }

  private generateTeamCode(): string {
    return randomBytes(this.TEAM_CODE_LENGTH).toString('hex').toUpperCase();
  }
}
