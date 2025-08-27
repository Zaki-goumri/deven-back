import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateHash } from 'src/common/utils/authentication/bcrypt.utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
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
}
