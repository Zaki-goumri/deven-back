import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LinkProvider } from 'src/common/entities/link-provider.entity';
import { Repository } from 'typeorm';
import { providers } from './data/links.data';

@Injectable()
export class LinksSeeder {
  constructor(
    @InjectRepository(LinkProvider)
    private readonly LinksRepo: Repository<LinkProvider>,
  ) {}
  async execute() {
    const createdLinks = this.LinksRepo.create(
      providers.map((provider) => provider),
    );
    const savedLinks = await this.LinksRepo.save(createdLinks);
    console.log('Links Seeded Succeffuly:', savedLinks.length);
  }
}
