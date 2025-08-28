import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateTeamDto {
  @IsNumber()
  @IsNotEmpty()
  hackathonId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8)
  code: string;

  @IsString()
  @IsOptional()
  description: string | null;
}
