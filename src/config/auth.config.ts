import { registerAs } from '@nestjs/config';
import { AuthConfig } from './interfaces/auth-config.interface';

export default registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'super-secret',
      refreshTokenSecret:
        process.env.JWT_REFRESH_TOKEN_SECRET || 'super-secret-refresh',
      accessTokenExpiresIn: parseInt(
        process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '900000',
      ), // 15 min
      refreshTokenExpiresIn: parseInt(
        process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || (86400 * 7).toString(),
      ), // 7 day
    },
    oauth: {
      google: {
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
        callbackURL:
          process.env.GOOGLE_OAUTH_CALLBACK_URL ||
          'http://localhost:3000/auth/google/redirect',
        scope: ['email', 'profile'],
        passReqToCallback: true,
      },
      github: {
        clientID: process.env.GITHUB_OAUTH_CLIENT_ID!,
        clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
        callbackURL:
          process.env.GITHUB_OAUTH_CALLBACK_URL ||
          'http://localhost:3000/auth/github/redirect',
        scope: ['user:email'],
        passReqToCallback: true,
      },
    },
  }),
);
