import { registerAs } from '@nestjs/config';
import { RedisConfig } from './interfaces/redis-config.interface';

export default registerAs(
  'redis',
  (): RedisConfig => ({
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
    persistentDb: parseInt(process.env.REDIS_PERSISTENT_DB!, 10) || 1,
    cachedDb: parseInt(process.env.REDIS_CACHED_DB!, 10) || 2,
  }),
);
