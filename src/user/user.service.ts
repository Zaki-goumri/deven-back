import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { generateHash } from 'src/common/utils/authentication/bcrypt.utils';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as GithubProfile } from 'passport-github2';
import { UserInfo } from './entities/userInfo.entity';
import { getProviderEnumfromString } from 'src/common/utils/authentication/provider.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async createOauthUser(profile: GoogleProfile | GithubProfile): Promise<User> {
    const provider = getProviderEnumfromString(profile.provider);
    const newUser = this.userRepository.create({
      email: profile.emails?.[0]?.value,
      username: profile.displayName || profile.username,
      isEmailVerified: true,
      isFirstLogin: true,
      provider,
    });

    const userInfo = this.userInfoRepository.create({
      firstName: profile.name?.givenName ?? '',
      lastName: profile.name?.familyName ?? '',
      //TODO we need to define this later and uncommnet this
      //profilePicture: profile.photos?.[0]?.value,
    });
    newUser.info = userInfo;
    return this.userRepository.save(newUser);
  }
  async createUser(data: registerDto, isSocialLogin = false): Promise<User> {
    const hashedPassword = await generateHash(data.password);
    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
      isEmailVerified: isSocialLogin,
    });
    return this.userRepository.save(newUser);
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
  //TODO type this later
  updateUser(id: number, updateData: Partial<User>) {
    return this.userRepository.update({ id }, updateData);
  }
  updateUserByEmail(email: string, updateData: Partial<User>) {
    return this.userRepository.update({ email }, updateData);
  }
  async getFollowedOrganizations(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        followedOrganizations: true,
      },
    });
    //Intentionally not using NotFoundException here to trigger refersh token interceptor on client side in case user not found
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user.followedOrganizations || [];
  }
  static getDisplayUserInclude(): FindOptionsSelect<User> {
    return {
      id: true,
      username: true,
      info: {
        firstName: true,
        lastName: true,
      },
    };
  }
}
