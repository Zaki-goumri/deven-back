import { Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthenticationService } from 'src/authentication/authentication.service';
import authConfig from 'src/config/auth.config';
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    private readonly authService: AuthenticationService,
  ) {
    super(authConfiguration.oauth.google);
  }
  validate(...args: any[]): unknown {
    throw new Error('Method not implemented.');
  }
}
