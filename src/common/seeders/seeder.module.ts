import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkProvider } from '../entities/link-provider.entity';
import { LinksSeeder } from './links/links.seeder';
import { UserSeeder } from './user/user.seeder';
import { User } from '../../user/entities/user.entity';
import { UserInfo } from '../../user/entities/userInfo.entity';
import databaseConfig from '../../config/database.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    TypeOrmModule.forFeature([LinkProvider, User, UserInfo]),
  ],
  providers: [LinksSeeder, UserSeeder],
})
export class SeederModule {}
