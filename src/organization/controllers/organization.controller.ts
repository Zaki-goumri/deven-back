import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { UpdateOrganizationDto } from '../dtos/update-organization.dto';
import { USER } from 'src/authentication/decorators/user.decorartor';
import { Organization } from '../entities/organization.entity';
import { AccessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { AddModeratorDto } from '../dtos/add-moderator.dto';
import {
  PaginationDtoRes,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { DisplayUserDto } from 'src/user/dto/display-user.dto';

@ApiBearerAuth()
@ApiTags('Organization')
@Controller('organization')
@UseGuards(AccessTokenGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({ summary: 'Create a new organization' })
  @ApiCreatedResponse({
    description: 'The organization has been successfully created.',
    type: Organization,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @USER('id') userId: number,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto, userId);
  }

  @ApiOperation({ summary: 'Get a single organization by ID' })
  @ApiOkResponse({
    description: 'Returns the organization.',
    type: Organization,
  })
  @ApiParam({ name: 'id', type: Number, description: 'Organization ID' })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Organization> {
    return this.organizationService.findOne(id);
  }

  @ApiOperation({ summary: 'Update an organization' })
  @ApiOkResponse({
    description: 'The organization has been successfully updated.',
    type: Organization,
  })
  @ApiParam({ name: 'id', type: Number, description: 'Organization ID' })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.updateOne(id, updateOrganizationDto);
  }

  @ApiOperation({ summary: 'Delete an organization' })
  @ApiOkResponse({
    description: 'The organization has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.organizationService.delete(id);
  }
  @ApiOperation({ summary: 'Add moderators to an organization' })
  @ApiOkResponse({
    description: 'Moderators have been successfully added.',
    type: Organization,
  })
  @ApiParam({ name: 'orgId', type: Number, description: 'Organization ID' })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Post('moderators/:orgId')
  addModerator(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Body() body: AddModeratorDto,
  ) {
    return this.organizationService.addModerators(body, orgId);
  }

  @ApiOperation({ summary: 'Get moderators of an organization' })
  @ApiOkResponse({
    description: 'Returns a paginated list of moderators.',
    type: [DisplayUserDto],
  })
  @ApiParam({ name: 'orgId', type: Number, description: 'Organization ID' })
  @ApiNotFoundResponse({ description: 'Organization not found.' })
  @Get('moderators/:orgId')
  getModerators(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationDtoRes<DisplayUserDto>> {
    return this.organizationService.getOrgModerators(orgId, paginationQuery);
  }

  @ApiOperation({ summary: 'Remove a moderator from an organization' })
  @ApiOkResponse({
    description: 'Moderator has been successfully removed.',
  })
  @ApiParam({ name: 'orgId', type: Number, description: 'Organization ID' })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'User ID of the moderator to remove',
  })
  @ApiNotFoundResponse({ description: 'Organization or Moderator not found.' })
  @Delete('moderators/:orgId/:userId')
  async removeModerator(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    await this.organizationService.removeModerators(userId, orgId);
    return { message: 'Moderator has been successfully removed.' };
  }
}
