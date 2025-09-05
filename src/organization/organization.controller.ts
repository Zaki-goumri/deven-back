import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { OrganizationService } from './services/organization.service';
import { OrganizationFollowService } from './services/organization_follow.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { USER } from 'src/authentication/decorators/user.decorartor';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { Organization } from './entities/organization.entity';
import { DisplayUserDto } from 'src/user/dto/display-user.dto';

@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationFollowService: OrganizationFollowService,
  ) {}

  // Organization Endpoints
  @ApiTags('Organization')
  @ApiOperation({ summary: 'Create a new organization' })
  @ApiBody({ type: CreateOrganizationDto })
  @ApiCreatedResponse({
    description: 'The organization has been successfully created.',
    type: Organization,
  })
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @USER('id') userId: number,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto, userId);
  }

  @ApiTags('Organization')
  @ApiOperation({ summary: 'Get a single organization by ID' })
  @ApiOkResponse({
    description: 'Returns the organization.',
    type: Organization,
  })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @ApiTags('Organization')
  @ApiOperation({ summary: 'Update an organization' })
  @ApiOkResponse({
    description: 'The organization has been successfully updated.',
    type: Organization,
  })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.updateOne(id, updateOrganizationDto);
  }

  @ApiTags('Organization')
  @ApiOperation({ summary: 'Delete an organization' })
  @ApiOkResponse({ description: 'The organization has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.organizationService.delete(id);
  }

  // Organization Follow Endpoints
  @ApiTags('Organization Follow')
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

  @ApiTags('Organization Follow')
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

  @ApiTags('Organization Follow')
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

  @ApiTags('Organization Follow')
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
