import { User } from 'src/user/entities/user.entity';

export interface AccessTokenPayload {
  sub: number; // User ID
  //For now I return the entire user object, but later I will return only necessary fields
  user: User; // User email
}
