import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
export interface ExtendedRequest extends Request {
  user: AccessTokenPayload['user'];
}
