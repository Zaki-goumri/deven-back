import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from '../entities/team-member.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectRepository(TeamMember)
    private readonly teamMemberRepo: Repository<TeamMember>,
    private readonly dataSource: DataSource,
  ) {}

  async join(userId: number, teamId: number, insertCode: string) {
    return await this.dataSource.transaction(async (manager) => {
      const teamData = await this.getTeamWithLock(manager, teamId); //lock it to ensure consistency

      this.ensureRegistrationOpen(teamData);
      this.ensureCodeMatches(teamData, insertCode);

      await this.ensureNotAlreadyMember(manager, userId, teamId);
      await this.ensureTeamHasCapacity(manager, teamId);

      await this.addMember(manager, userId, teamId);

      return { success: true, message: 'User joined the team' };
    });
  }

  private async getTeamWithLock(manager: EntityManager, teamId: number) {
    const teamData = await manager
      .createQueryBuilder()
      .select([
        'team.id',
        'team.code',
        'hackathon.maxInTeam',
        'hackathon.registrationDate',
      ])
      .from('team', 'team')
      .innerJoin('hackathon', 'hackathon', 'hackathon.id = team.hackathonId')
      .where('team.id = :teamId', { teamId })
      .setLock('pessimistic_write')
      .getRawOne<{
        teamId: number;
        teamCode: string;
        hackathonMaxInTeam: number;
        hackathonRegistrationDate: Date;
      }>();

    if (!teamData) {
      throw new NotFoundException('Team not found');
    }

    return teamData;
  }

  private ensureRegistrationOpen(teamData: {
    hackathonRegistrationDate: Date;
  }) {
    if (new Date(teamData.hackathonRegistrationDate) < new Date()) {
      throw new BadRequestException('Registration is closed');
    }
  }

  private ensureCodeMatches(
    teamData: { teamCode: string },
    insertCode: string,
  ) {
    if (teamData.teamCode !== insertCode) {
      throw new BadRequestException('Invalid code');
    }
  }

  private async ensureNotAlreadyMember(
    manager: EntityManager,
    userId: number,
    teamId: number,
  ): Promise<void> {
    const exists = await manager
      .createQueryBuilder()
      .select('1')
      .from('team_member', 'member')
      .where('member.userId = :userId', { userId })
      .andWhere('member.teamId = :teamId', { teamId })
      .getRawOne<{ exists: number }>();

    if (exists) {
      throw new ConflictException('User already in this team');
    }
  }

  private async ensureTeamHasCapacity(manager: EntityManager, teamId: number) {
    const { count } = (await manager
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('team_member', 'member')
      .where('member.teamId = :teamId', { teamId })
      .getRawOne<{ count: string }>()) ?? { count: '0' };

    const memberCount = parseInt(count, 10);
    return memberCount;
  }

  private async addMember(
    manager: EntityManager,
    userId: number,
    teamId: number,
  ) {
    await manager
      .createQueryBuilder()
      .insert()
      .into('team_member')
      .values({ userId, teamId })
      .execute();
  }

  kick() {}
  leave() {}
  changeOwenShip() {}
}
