import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationLink } from './entities/org_link.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './services/organization.service';
import { OrganizationFollowService } from './services/organization_follow.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationLink, Organization]),
    UserService,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationFollowService],
})
export class OrganizationModule {}
