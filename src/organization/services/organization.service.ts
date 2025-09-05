import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationLink } from './entities/org_link.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(OrganizationLink)
    private readonly linkRepo: Repository<OrganizationLink>,
  ) {}
  create(data: CreateOrganizationDto, userId: number): Promise<Organization> {
    const newOrg = this.organizationRepo.create({
      ...data,
      isVerified: false,

      Owner: { id: userId },
      //This should be moved to a location service to avoid duplicate locations
      location: { ...data.location },
    });

    const links = data.links.map((link) => {
      return this.linkRepo.create({
        ...link,
      });
    });
    //Auto save since cascade is true on links
    newOrg.link = links;
    return this.organizationRepo.save(newOrg);
  }
  async delete(id: number): Promise<boolean> {
    const res = await this.organizationRepo.softDelete({ id });
    if (res.affected == 0) {
      throw new NotFoundException('Organization not found');
    }
    return true;
  }
}
