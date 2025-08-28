import { Inject, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';

import { Profile, Strategy } from 'passport-github2';
import { VerifyCallback } from 'passport-google-oauth20';
import { AuthenticationService } from 'src/authentication/authentication.service';
import authConfig from 'src/config/auth.config';
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly authService: AuthenticationService,
  ) {
    super(authConfiguration.oauth.github);
  }
  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = await this.authService.logOauthUser(profile);
    return done(null, user);
  }
}
