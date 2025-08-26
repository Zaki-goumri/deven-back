import { PartialType } from '@nestjs/swagger';
import { CreateAchivenemntDto } from './create-achivenemnt.dto';

export class UpdateAchivenemntDto extends PartialType(CreateAchivenemntDto) {}
