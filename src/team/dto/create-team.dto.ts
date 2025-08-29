import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ description: 'name of the team an a hackathon' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  name: string;

  @ApiProperty({ description: 'description of the team' })
  @IsString()
  @IsOptional()
  description: string | null;
}
