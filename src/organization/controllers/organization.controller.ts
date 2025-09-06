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
  delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.organizationService.delete(id);
  }
}
