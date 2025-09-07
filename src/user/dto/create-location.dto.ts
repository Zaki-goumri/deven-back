import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, IsNotEmpty } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    description: 'The name of the location',
    example: 'Epitech',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'The city of the location',
    example: 'Paris',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    description: 'The Google Maps link of the location',
    example: 'https://maps.app.goo.gl/xxxxxxxxxxxx',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  mapsLink: string;
}
