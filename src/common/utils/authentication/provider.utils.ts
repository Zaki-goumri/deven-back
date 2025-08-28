import { InternalServerErrorException } from '@nestjs/common';
import {
  UserProvider,
  UserProviderType,
} from 'src/user/types/use-provider.type';

export function getProviderEnumfromString(provider: string): UserProviderType {
  switch (provider) {
    case 'google':
      return UserProvider.GOOGLE;
    case 'github':
      return UserProvider.GITHUB;
    default:
      throw new InternalServerErrorException(
        `Unsupported provider: ${provider}`,
      );
  }
}
