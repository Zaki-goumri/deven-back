import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinkProvider } from 'src/common/entities/link-provider.entity';
import { LinksSeeder } from './links.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([LinkProvider])],
  providers: [LinksSeeder],
})
export class LinksModule {}
