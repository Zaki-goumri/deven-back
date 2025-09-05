/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DisplayUserDto } from 'src/user/dto/display-user.dto';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OrganizationFollowService {
  logger = new Logger(OrganizationFollowService.name);
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
  ) {}
  async follow(orgId: number, userId: number): Promise<void> {
    this.logger.log(`User ${userId} followed organization ${orgId}`);

    //Already regretting using implicit many to many relation (footnote ignore this)
    const isAlreadyFollowed = await this.isAlreadyFollowed(orgId, userId);
    if (isAlreadyFollowed) {
      this.logger.warn(`User ${userId} already follows organization ${orgId}`);
      throw new ConflictException('User already follows this organization');
    }
    await this.dataSource
      .createQueryBuilder()
      .relation(Organization, 'followers')
      .of(orgId)
      .add(userId);

    return;
  }
  private async isAlreadyFollowed(
    orgId: number,
    userId: number,
  ): Promise<boolean> {
    //Add caching here
    const org = await this.orgRepo.findOne({
      where: { id: orgId },
      relations: ['followers'],
    });
    if (!org) {
      throw new NotFoundException(`Organization with ID ${orgId} not found`);
    }
    return org.followers.some((follower) => follower.id === userId);
  }

  async unfollow(orgId: number, userId: number): Promise<void> {
    this.logger.log(`User ${userId} unfollowed organization ${orgId}`);
    const isAlreadyFollowed = await this.isAlreadyFollowed(orgId, userId);
    if (!isAlreadyFollowed) {
      this.logger.warn(`User ${userId} does not follow organization ${orgId}`);
      throw new NotFoundException('User does not follow this organization');
    }
    await this.dataSource
      .createQueryBuilder()
      .relation(Organization, 'followers')
      .of(orgId)
      .remove(userId);
    return;
  }
  async getFollowers(
    orgId: number,
    { lastId, take }: PaginationQueryDto,
  ): Promise<DisplayUserDto[]> {
    const qb = this.orgRepo
      .createQueryBuilder('org')
      .leftJoin('org.followers', 'follower')
      .leftJoinAndSelect('follower.info', 'info')
      .where('org.id = :orgId', { orgId })

      .andWhere('follower.id >= :lastId', { lastId })
      .orderBy('follower.id', 'ASC')
      .take(take)
      .select([
        'follower.id',
        'follower.username',
        'follower.email',
        'info.firstName',
        'info.lastName',
      ]);

    //Just fuck typeorm at this point
    const followersRaw = await qb.getRawMany();
    if (!followersRaw) {
      throw new NotFoundException(`Organization with ID ${orgId} not found`);
    }
    return followersRaw.map((follower) => this.mapToDisplayUserDto(follower));
  }
  private mapToDisplayUserDto(user: any): DisplayUserDto {
    const mapToDisplayUserDto = (row: any): DisplayUserDto => ({
      id: row.follower_id,
      username: row.follower_username,
      info: {
        firstName: row.info_firstName || '',
        lastName: row.info_lastName || '',
      },
    });
    return mapToDisplayUserDto(user);
  }
  async getFollowedOrgs(userId: number): Promise<Organization[]> {
    return this.userService.getFollowedOrganizations(userId);
  }
}
