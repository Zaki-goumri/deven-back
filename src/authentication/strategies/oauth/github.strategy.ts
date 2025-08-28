import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-github2';
import { AuthenticationService } from 'src/authentication/authentication.service';
import authConfig from 'src/config/auth.config';
export class GithubStrategy extends PassportStrategy(Strategy,'github') {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly authService: AuthenticationService,
  ) {
    console.log('GitHub Strategy Config:', authConfiguration.oauth.github);
    super(authConfiguration.oauth.github);
  }
  validate(...args: any[]): unknown {
    throw new Error('Method not implemented.');
  }
}
