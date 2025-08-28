import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamInvite } from './entities/team-invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember, TeamInvite])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
