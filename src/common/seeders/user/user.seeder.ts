import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { users } from './data/user.data';
import { UserInfo } from '../../../user/entities/userInfo.entity';

@Injectable()
export class UserSeeder {
  private readonly logger = new Logger('UserSeeder');
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInfo)
    private readonly userInfoRepository: Repository<UserInfo>,
  ) {}

  async execute() {
    const usersToCreate: User[] = [];
    for (const userData of users) {
      const userInfo = this.userInfoRepository.create({
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      const user = this.userRepository.create({
        email: userData.email,
        password: userData.password,
        username: userData.email.split('@')[0],
        info: userInfo,
      });

      usersToCreate.push(user);
    }

    const savedUsers = await this.userRepository.save(usersToCreate);
    this.logger.log(`Users Seeded Successfully: ${savedUsers.length}`);
  }
}
