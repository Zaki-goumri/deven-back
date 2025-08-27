import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  createUser(data: registerDto): Promise<User> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  findById(id: string): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
}
