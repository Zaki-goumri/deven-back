import {
  BadRequestException,
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
    return this.dataSource.transaction(async (manager) => {
      const teamData = await this.getTeamWithMembersAndLock(manager, teamId);

      this.ensureRegistrationOpen(teamData);
      this.ensureCodeMatches(teamData, insertCode);

      const isAlreadyMember = teamData.members.includes(userId);

      if (
        !isAlreadyMember &&
        teamData.members.length >= teamData.hackathonMaxInTeam
      ) {
        throw new BadRequestException('Team is full');
      }

      if (!isAlreadyMember) {
        await this.addMember(manager, userId, teamId);
        teamData.members.push(userId);
      }

      // no need to concentrate on return type now until fix the ui
      return {
        success: true,
        message: isAlreadyMember
          ? 'User already in the team'
          : 'User joined the team',
        memberCount: teamData.members.length,
      };
    });
  }

  //
  // ─── HELPERS ──────────────────────────────────────────────
  //

  private async getTeamWithMembersAndLock(
    manager: EntityManager,
    teamId: number,
  ) {
    const raw = await manager
      .createQueryBuilder()
      .select([
        'team.id AS teamId',
        'team.code AS teamCode',
        'hackathon.maxInTeam AS hackathonMaxInTeam',
        'hackathon.registrationDate AS hackathonRegistrationDate',
        'member.userId AS memberUserId',
      ])
      .from('team', 'team')
      .innerJoin('hackathon', 'hackathon', 'hackathon.id = team.hackathonId')
      .leftJoin('team_member', 'member', 'member.teamId = team.id')
      .where('team.id = :teamId', { teamId })
      .setLock('pessimistic_write')
      .getRawMany<{
        teamId: number;
        teamCode: string;
        hackathonMaxInTeam: number;
        hackathonRegistrationDate: Date;
        memberUserId: number | null;
      }>();

    if (!raw.length) {
      throw new NotFoundException('Team not found');
    }

    const { teamCode, hackathonMaxInTeam, hackathonRegistrationDate } = raw[0];

    return {
      teamId,
      teamCode,
      hackathonMaxInTeam,
      hackathonRegistrationDate,
      members: raw
        .map((r) => r.memberUserId)
        .filter((id): id is number => id !== null),
    };
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

  private async addMember(
    manager: EntityManager,
    userId: number,
    teamId: number,
  ): Promise<{ id: number; userId: number; teamId: number; createdAt: Date }> {
    const result = await manager
      .createQueryBuilder()
      .insert()
      .into('team_member')
      .values({ userId, teamId })
      .returning(['id', 'userId', 'teamId', 'createdAt'])
      .execute();

    /*eslint-disable-next-line*/
    const inserted = result.raw[0] as {
      id: number;
      userId: number;
      teamId: number;
      createdAt: Date;
    };

    return inserted;
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
