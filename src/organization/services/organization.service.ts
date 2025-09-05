import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOptionsSelect, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { OrganizationLink } from '../entities/org_link.entity';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { UpdateOrganizationDto } from '../dtos/update-organization.dto';
import { UserService } from 'src/user/user.service';

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
    const affected = await organizationTx.update(
      { id: orgId },
      {
        ...data,
        location: { ...data.location },
        link: data.links,
      },
    );
    if (affected.affected == 0) {
      throw new NotFoundException('Organization not found');
    }
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

    //Safe to assume it exists since the affected is not 0 and we are on a transaction here (important)
    await queryRunner.commitTransaction();
    await queryRunner.release();
    return org!;
  }
  async findOne(id: number): Promise<Organization> {
    const org = await this.organizationRepo.findOne({
      where: { id },
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
      throw new NotFoundException('Organization not found');
    }
    return org;
  }

  async delete(id: number): Promise<boolean> {
    const res = await this.organizationRepo.softDelete({ id });
    if (res.affected == 0) {
      throw new NotFoundException('Organization not found');
    }
    return true;
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
