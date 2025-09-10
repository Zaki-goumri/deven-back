import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkProvider } from '../../entities/link-provider.entity';
import { Repository } from 'typeorm';
import { providers } from './data/links.data';

@Injectable()
export class LinksSeeder {
  private readonly logger = new Logger('LinksSeeder');
  constructor(
    @InjectRepository(LinkProvider)
    private readonly LinksRepo: Repository<LinkProvider>,
  ) {}
  async execute() {
    const createdLinks = this.LinksRepo.create(
      providers.map((provider) => provider),
    );
    const savedLinks = await this.LinksRepo.save(createdLinks);
    this.logger.log(`Links Seeded Successfully: ${savedLinks.length}`);
  }
}
