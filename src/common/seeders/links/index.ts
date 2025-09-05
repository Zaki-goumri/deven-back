import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { LinksSeeder } from './links.seeder';
import { SeederModule } from '../seeder.module';

const logger: Logger = new Logger('BadgeSeeder');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const linksSeeder = app.get(LinksSeeder);

  await linksSeeder.execute();
  await app.close();
}

bootstrap().catch((error) => {
  logger.error('Error seeding badges', error);
  process.exit(1);
});
