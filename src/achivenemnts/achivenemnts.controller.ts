import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AchivenemntsService } from './achivenemnts.service';
import { CreateAchivenemntDto } from './dto/create-achivenemnt.dto';
import { UpdateAchivenemntDto } from './dto/update-achivenemnt.dto';

@Controller('achivenemnts')
export class AchivenemntsController {
  constructor(private readonly achivenemntsService: AchivenemntsService) {}

  @Post()
  create(@Body() createAchivenemntDto: CreateAchivenemntDto) {
    return this.achivenemntsService.create(createAchivenemntDto);
  }

  @Get()
  findAll() {
    return this.achivenemntsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.achivenemntsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAchivenemntDto: UpdateAchivenemntDto,
  ) {
    return this.achivenemntsService.update(+id, updateAchivenemntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achivenemntsService.remove(+id);
  }
}
