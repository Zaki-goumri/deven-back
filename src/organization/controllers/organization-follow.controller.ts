import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrganizationFollowService } from '../services/organization_follow.service';
import { USER } from 'src/authentication/decorators/user.decorartor';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { Organization } from '../entities/organization.entity';
import { DisplayUserDto } from 'src/user/dto/display-user.dto';

@ApiBearerAuth()
@ApiTags('Organization Follow')
@Controller('organization')
export class OrganizationFollowController {
  constructor(
    private readonly organizationFollowService: OrganizationFollowService,
  ) {}

  @ApiOperation({ summary: 'Follow an organization' })
  @ApiOkResponse({ description: 'Successfully followed the organization.' })
  @ApiConflictResponse({ description: 'User already follows this organization.' })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Post(':id/follow')
  @HttpCode(HttpStatus.OK)
  follow(
    @Param('id', ParseIntPipe) orgId: number,
    @USER('id') userId: number,
  ): Promise<void> {
    return this.organizationFollowService.follow(orgId, userId);
  }

  @ApiOperation({ summary: 'Unfollow an organization' })
  @ApiOkResponse({ description: 'Successfully unfollowed the organization.' })
  @ApiNotFoundResponse({
    description: 'User does not follow this organization or organization not found.',
  })
  @Delete(':id/follow')
  @HttpCode(HttpStatus.OK)
  unfollow(
    @Param('id', ParseIntPipe) orgId: number,
    @USER('id') userId: number,
  ): Promise<void> {
    return this.organizationFollowService.unfollow(orgId, userId);
  }

  @ApiOperation({ summary: "Get an organization's followers" })
  @ApiOkResponse({
    description: 'Returns a list of followers.',
    type: [DisplayUserDto],
  })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Get(':id/followers')
  getFollowers(
    @Param('id', ParseIntPipe) orgId: number,
    @Query() paginationDto: PaginationQueryDto,
  ): Promise<DisplayUserDto[]> {
    return this.organizationFollowService.getFollowers(orgId, paginationDto);
  }

  @ApiOperation({ summary: 'Get organizations followed by the current user' })
  @ApiOkResponse({
    description: 'Returns a list of followed organizations.',
    type: [Organization],
  })
  @Get('followed/me')
  getFollowedOrgs(@USER('id') userId: number): Promise<Organization[]> {
    return this.organizationFollowService.getFollowedOrgs(userId);
  }
}
