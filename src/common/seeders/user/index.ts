import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../seeder.module';
import { UserSeeder } from './user.seeder';
import { Logger } from '@nestjs/common';

const logger: Logger = new Logger('UserSeeder');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['verbose', 'debug', 'log', 'warn', 'error', 'fatal'],
  });
  const userSeeder = appContext.get(UserSeeder);
  await userSeeder.execute();
  await appContext.close();
  /* TODO: add db filter */
}

bootstrap().catch((error) => {
  logger.error('Error seeding users', error);
  process.exit(1);
});
