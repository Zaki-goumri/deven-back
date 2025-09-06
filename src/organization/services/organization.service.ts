import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, DataSource, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationLink } from '../entities/org_link.entity';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { UpdateOrganizationDto } from '../dtos/update-organization.dto';
import { UserService } from 'src/user/user.service';
import { DisplayUserDto } from 'src/user/dto/display-user.dto';
import {
  PaginationDtoRes,
  PaginationQueryDto,
} from 'src/common/dtos/pagination.dto';
import { AddModeratorDto } from '../dtos/add-moderator.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(OrganizationLink)
    private readonly linkRepo: Repository<OrganizationLink>,
    private readonly dataSource: DataSource,
  ) {}

  create(data: CreateOrganizationDto, userId: number): Promise<Organization> {
    const newOrg = this.organizationRepo.create({
      ...data,
      isVerified: false,

      Owner: { id: userId },
      //This should be moved to a location service to avoid duplicate locations
      location: { ...data.location },
    });

    if (data.links && data.links.length > 0) {
      const links = data.links.map((link) => {
        return this.linkRepo.create({
          ...link,
        });
      });
      //Auto save since cascade is true on links
      newOrg.link = links;
    }
    return this.organizationRepo.save(newOrg);
  }
  async updateOne(
    orgId: number,
    data: UpdateOrganizationDto,
  ): Promise<Organization> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    //Important  to set read commited here so we can return the version that the user updated in case there was a concurrent update (or delete)
    await queryRunner.startTransaction('REPEATABLE READ');
    const organizationTx = queryRunner.manager.getRepository(Organization);
    const org = await organizationTx.findOne({
      where: { id: orgId },
      relations: {
        link: true,
        location: true,

        Owner: {
          info: true,
        },
      },
      select: {
        ...OrganizationService.getOragnizationSelect(),
        Owner: UserService.getDisplayUserInclude(),
      },
    });
    if (!org) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new NotFoundException('Organization not found');
    }
    Object.assign(org, {
      ...data,
      location: data.location ? { ...data.location } : org.location,
      links: data.links ? [...data.links] : org.link,
    });

    await organizationTx.save(org);
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return org;
  }
  async delete(id: number): Promise<void> {
    const result = await this.organizationRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Organization not found');
    }
    return;
  }
  async findOne(id: number): Promise<Organization> {
    const org = await this.organizationRepo.findOne({
      where: { id },
      relations: {
        link: {
          provider: true,
        },
        location: true,
        Owner: {
          info: true,
        },
      },
      select: {
        ...OrganizationService.getOragnizationSelect(),
        Owner: UserService.getDisplayUserInclude(),
      },
    });

    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return org;
  }
  async addModerators({ usersIds }: AddModeratorDto, orgId: number) {
    await this.organizationRepo
      .createQueryBuilder('org')
      .relation('org.moderators')
      .of(orgId)
      .add(usersIds);

    return;
  }
  async removeModerators(userId: number, orgId: number) {
    await this.organizationRepo
      .createQueryBuilder('org')
      .relation('org.moderators')
      .of(orgId)
      .remove(userId);
    return;
  }
  async getOrgModerators(
    orgId: number,
    { lastId, take }: PaginationQueryDto,
  ): Promise<PaginationDtoRes<DisplayUserDto>> {
    const org = await this.organizationRepo.findOne({
      where: {
        id: orgId,
        moderators: {
          id: Between(lastId, lastId + take - 1),
        },
      },
      order: {
        moderators: {
          id: 'ASC',
        },
      },
      relations: {
        moderators: {
          info: true,
        },
      },
      select: {
        moderators: UserService.getDisplayUserInclude(),
        id: true,
      },
    });
    if (!org) {
      throw new NotFoundException('Organization not found');
    }
    return {
      take,
      lastId: org.moderators[org.moderators.length - 1]?.id || lastId,
      data: org.moderators,
      success: true,
      hasMore: org.moderators.length < take,
    };
  }
  async getUserRoles(
    orgId: number,
    userId: number,
  ): Promise<{ isMod: boolean; isOwner: boolean }> {
    const organization = await this.organizationRepo.findOne({
      where: { id: orgId },
      relations: { Owner: true, moderators: true },
      select: { id: true, Owner: { id: true }, moderators: { id: true } },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return {
      isMod: organization.moderators.some((mod) => mod.id === userId),
      isOwner: organization.Owner.id === userId,
    };
  }

  static getOragnizationSelect(): FindOptionsSelect<Organization> {
    return {
      id: true,
      isVerified: true,
      name: true,
      description: true,
      location: true,
      link: true,
      university: true,
      createdAt: true,
      updatedAt: true,
    };
  }
}
