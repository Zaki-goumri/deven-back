import { PassportStrategy } from '@nestjs/passport';

import { Strategy } from 'passport-github2';
export class GithubStrategy extends PassportStrategy(Strategy) {
  validate(...args: any[]): unknown {
      throw new Error('Method not implemented.');
  }
  }
