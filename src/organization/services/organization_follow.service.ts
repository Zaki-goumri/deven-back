import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import { Logger } from '@nestjs/common';

export class OrganizationFollowService {
  logger = new Logger(OrganizationFollowService.name);
  constructor(
    @InjectRepository(Organization) private readonly: Repository<Organization>,
  ) {}
  //Todo implenment this
  async follow(orgId: number, userId: number): Promise<boolean> {}
  async unfollow(orgId: number, userId: number): Promise<boolean> {}
  async getFollowers(orgId: number): Promise<User> {}
  async getFollowedOrgs(userId: number): Promise<Organization[]> {}
}
