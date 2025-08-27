import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticationService } from '../authentication.service';
import { User } from 'src/user/entities/user.entity';

import { Request } from 'express';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req:Request,email: string, password: string): Promise<User> {

    const user = await this.authenticationService.validateUser(email, password);
    return user;
  }
}
