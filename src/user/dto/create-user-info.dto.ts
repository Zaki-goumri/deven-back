import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsArray, IsUUID } from 'class-validator';

export class CreateUserInfoDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'A short bio of the user',
    example: 'I am a software engineer',
  })
  @IsString()
  @IsOptional()
  aboutMe?: string;

  @ApiProperty({
    description: 'The birthday of the user',
    example: '1990-01-01',
  })
  @IsDate()
  @IsOptional()
  birthday?: Date;

  @ApiProperty({
    description: 'The skills of the user',
    example: ['nestjs', 'typescript'],
  })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    description: 'The id of the location of the user',
    example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  })
  @IsUUID()
  locationId: string;
}
