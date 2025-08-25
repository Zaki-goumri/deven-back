import { PartialType } from '@nestjs/swagger';
import { CreateHackathonDto } from './create-hackathon.dto';

export class UpdateHackathonDto extends PartialType(CreateHackathonDto) {}
