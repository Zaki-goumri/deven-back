import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TeamService } from './services/team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { Team } from './entities/team.entity';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { USER } from 'src/authentication/decorators/user.decorartor';
import { SWAGGER_DESC } from 'src/common/constants/swagger-docs';
import { TeamMemberService } from './services/team-member.service';

//NOTE: need to add types to swagger docs

@ApiTags('Teams')
@UseGuards(AcessTokenGuard)
// common responses
@ApiTooManyRequestsResponse({
  description: SWAGGER_DESC.TOO_MANY_REQUESTS,
  type: String,
  example: 'too many requests',
})
@ApiInternalServerErrorResponse({
  description: SWAGGER_DESC.INTERNAL_SERVER_ERROR,
  example: 'Internal Server Error',
})
@ApiUnauthorizedResponse({
  description: SWAGGER_DESC.UNAUTHORIZED,
  example: 'User unauthorized',
})
@Controller('teams')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly teamMemberService: TeamMemberService,
  ) {}

  @Post(':hackathonId')
  @ApiOperation({ summary: 'Create a new team in a hackathon' })
  @ApiCreatedResponse({
    description: 'Team created successfully',
    type: Team,
  })
  async create(
    @Param('hackathonId', ParseIntPipe) hackathonId: number,
    @Body() dto: CreateTeamDto,
    @USER('id') createdById: number,
  ) {
    return this.teamService.create(dto, hackathonId, createdById);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team by ID' })
  @ApiOkResponse({ description: 'Team found', type: Team })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return this.teamService.getOne(id);
  }

  @Get('hackathon/:hackathonId')
  @ApiOperation({ summary: 'Get many teams with pagination' })
  @ApiResponse({ status: 200, description: 'List of teams with pagination' })
  async getMany(
    @Query() query: PaginationQueryDto,
    @Param('hackathonId', ParseIntPipe) hackathonId: number,
  ) {
    return this.teamService.getMany(query, hackathonId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a team by ID' })
  @ApiOkResponse({ description: 'Team updated successfully' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTeamDto,
  ) {
    return this.teamService.update(dto, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a team by ID' })
  @ApiOkResponse({ description: 'Team deleted successfully' })
  @ApiNotFoundResponse({ description: 'Team not found' })
  @ApiUnauthorizedResponse({
    description: 'check if the user who delete the team is the creator or not ',
  })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @USER('id') userId: number,
  ) {
    return this.teamService.remove(id, userId);
  }

  // ─── TEAM MEMBER ACTIONS ─────────────────────────────

  @Post('member/join/:code')
  @ApiOperation({ summary: 'Join a team using invite code' })
  @ApiOkResponse({
    description: 'User joined the team',
    schema: {
      example: {
        success: true,
        message: 'User joined the team',
        memberCount: 3,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid code, registration closed, or team is full',
  })
  @ApiNotFoundResponse({ description: 'Team not found' })
  async join(@USER('id') userId: number, @Param('code') insertCode: string) {
    return this.teamMemberService.join(userId, insertCode);
  }

  @Delete('member/:teamId/kick/:kickedId')
  @ApiOperation({ summary: 'Kick a member from a team' })
  @ApiOkResponse({ description: 'Member kicked successfully' })
  @ApiBadRequestResponse({ description: 'Hackathon started or self-kick' })
  @ApiForbiddenResponse({ description: 'Only owner can kick members' })
  @ApiNotFoundResponse({ description: 'Team or member not found' })
  async kick(
    @USER('id') kickedBy: number,
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('kickedId', ParseIntPipe) kickedId: number,
  ) {
    return this.teamMemberService.kick(kickedBy, kickedId, teamId);
  }

  @Delete('member/:teamId/leave')
  @ApiOperation({ summary: 'Leave a team' })
  @ApiOkResponse({ description: 'Successfully left the team' })
  @ApiBadRequestResponse({
    description:
      'Hackathon terminated or owner cannot leave without transferring ownership',
  })
  @ApiNotFoundResponse({ description: 'Team or member not found' })
  async leave(
    @USER('id') userId: number,
    @Param('teamId', ParseIntPipe) teamId: number,
  ) {
    return this.teamMemberService.leave(userId, teamId);
  }
}
