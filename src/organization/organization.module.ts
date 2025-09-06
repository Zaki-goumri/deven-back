import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationLink } from './entities/org_link.entity';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './services/organization.service';
import { OrganizationFollowService } from './services/organization_follow.service';
import { UserModule } from 'src/user/user.module';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationFollowController } from './controllers/organization-follow.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationLink, Organization]),
    UserModule,
  ],
  controllers: [OrganizationController, OrganizationFollowController],
  providers: [OrganizationService, OrganizationFollowService],
})
export class OrganizationModule {}
