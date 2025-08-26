import { AppConfig } from './interfaces/app-config.interface';

export default (): AppConfig => ({
  redis: {
    host: process.env.REDIS_HOST || 'redis',
    port: parseInt(process.env.REDIS_PORT!, 10) || 6379,
    persistentDb: parseInt(process.env.REDIS_PERSISTENT_DB!, 10) || 1,
    cachedDb: parseInt(process.env.REDIS_CACHED_DB!, 10) || 2,
  },

  auth: {
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET!,
      refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET!,
      accessTokenExpiresIn: parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '900000',
      ), // 15 min
      refreshTokenExpiresIn: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || (86400 * 7).toString(),
      ), // 7 day
    },
  },
});
