import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HackathonService } from './hackathon.service';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';

@Controller('hackathon')
export class HackathonController {
  constructor(private readonly hackathonService: HackathonService) {}

  @Post()
  create(@Body() createHackathonDto: CreateHackathonDto) {
    return this.hackathonService.create(createHackathonDto);
  }

  @Get()
  findAll() {
    return this.hackathonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hackathonService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHackathonDto: UpdateHackathonDto) {
    return this.hackathonService.update(+id, updateHackathonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hackathonService.remove(+id);
  }
}
