import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkProvider } from 'src/common/entities/link-provider.entity';
import { LinksSeeder } from './links/links.seeder';
import databaseConfig from 'src/config/database.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinkProvider]),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
  ],
  providers: [LinksSeeder],
})
export class SeederModule {}
