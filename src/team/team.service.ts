import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
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
import { TeamInvite } from './entities/team-invite.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
    private readonly redisService: RedisService,
    @InjectRepository(TeamInvite)
    private readonly teamInviteRepo: Repository<TeamInvite>,
  ) {}
  private logger = new Logger(LOGGER_NAMES.TEAMS);
  static CACHE_PREFIX = 'team';
  static getCacheKey(id: number) {
    return `${TeamService.CACHE_PREFIX}:${id}`;
  }

  async create(dto: CreateTeamDto) {
    const maxTries = 5;
    for (let i = 0; i < maxTries; i++) {
      try {
        const code = this.generateTeamCode();
        const team = this.teamRepo.create({ ...dto, code });
        await this.teamRepo.save(team);
        this.logger.log(`team with id ${team.id}`);
        break;
        /*eslint-disable-next-line*/
      } catch (err: unknown) {
        continue;
      }
    }
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
    return teamFromDb;
  }
  async getMany({ take = 10, lastId = 0 }: PaginationQueryDto) {
    const [teams] = await this.teamRepo.findAndCount({
      where: {
        id: MoreThan(lastId),
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

    if (!result.affected) throw new BadRequestException('update rejected');
    await this.redisService.del(TeamService.getCacheKey(id));
    const updatedTeam = Array.isArray(result.raw)
      ? (result.raw[0] as Team)
      : null;
    return updatedTeam;
  }
  async remove(id: number) {
    await this.cancelInvitation(id);
    const { affected } = await this.teamRepo.delete({ id });
    if (!affected)
      throw new BadRequestException('team not found or something is wrong ');
    return { succes: true, message: 'team is deleted ' };
  }

  private generateTeamCode(): string {
    return randomBytes(3).toString('hex').toUpperCase();
  }
  // let it here for now until create invitations service
  private async cancelInvitation(id: number) {
    const { affected } = await this.teamInviteRepo.update(
      { team: { id } },
      { isAccepted: false },
    );
    if (!affected) throw new BadRequestException('Invitation not found');
  }
}
