import { Injectable } from '@nestjs/common';
import { CreateAchivenemntDto } from './dto/create-achivenemnt.dto';
import { UpdateAchivenemntDto } from './dto/update-achivenemnt.dto';

@Injectable()
export class AchivenemntsService {
  create(createAchivenemntDto: CreateAchivenemntDto) {
    return 'This action adds a new achivenemnt';
  }

  findAll() {
    return `This action returns all achivenemnts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} achivenemnt`;
  }

  update(id: number, updateAchivenemntDto: UpdateAchivenemntDto) {
    return `This action updates a #${id} achivenemnt`;
  }

  remove(id: number) {
    return `This action removes a #${id} achivenemnt`;
  }
}
