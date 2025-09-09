import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeder.module';
import { UserSeeder } from './user.seeder';
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger('BadgeSeeder');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const userSeeder = appContext.get(UserSeeder);
  await userSeeder.execute();
  await appContext.close();
}

bootstrap().catch((error) => {
  logger.error('Error seeding users', error);
  process.exit(1);
});
