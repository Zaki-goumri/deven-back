import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamMember } from '../entities/team-member.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

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

  //
  // ─── HELPERS ──────────────────────────────────────────────
  //

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

  async kick(kickedBy: number, kickedId: number, teamId: number) {
    return this.dataSource.transaction(async (manager) => {
      const team = await this.getTeamWithHackathon(manager, teamId);

      this.ensureOwner(team, kickedBy);
      this.ensureHackathonNotStarted(team);
      this.ensureNotSelfKick(kickedBy, kickedId);

      await this.removeMember(manager, teamId, kickedId);

      return { message: 'Member kicked successfully' };
    });
  }

  //
  // ─── HELPERS ──────────────────────────────────────────────
  //

  private async getTeamWithHackathon(
    manager: EntityManager,
    teamId: number,
  ): Promise<Team> {
    const team = await manager
      .createQueryBuilder(Team, 'team')
      .innerJoinAndSelect('team.hackathon', 'hackathon')
      .where('team.id = :teamId', { teamId })
      .getOne();

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    return team;
  }

  private ensureOwner(team: Team, userId: number) {
    if (team.ownerId !== userId) {
      throw new ForbiddenException('Only the team owner can kick members');
    }
  }

  private ensureHackathonNotStarted(team: Team) {
    if (team.hackathon.startDate <= new Date()) {
      throw new BadRequestException(
        'Cannot kick members after hackathon has started',
      );
    }
  }

  private ensureNotSelfKick(kickedBy: number, kickedId: number) {
    if (kickedBy === kickedId) {
      throw new BadRequestException('Owner cannot kick himself');
    }
  }

  private async removeMember(
    manager: EntityManager,
    teamId: number,
    kickedId: number,
  ) {
    const result = await manager
      .createQueryBuilder()
      .delete()
      .from(TeamMember)
      .where('teamId = :teamId', { teamId })
      .andWhere('userId = :kickedId', { kickedId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException('Member not found in this team');
    }
  }

  leave() {}
  changeOwenShip() {}
}
