import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { result } from 'src/common/utils/result.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  createUser(data: registerDto): Promise<result<User, string>> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: string): Promise<result<User | null, string>> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<result<User | null, string>> {
    throw new Error('Method not implemented.');
  }
}
