import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsUrl,
  MinLength,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLinkDto {
  @ApiProperty({
    description: 'the id of the provider',
    example: 1,
    required: true,
  })
  @IsNumber()
  providerId: number;

  @ApiProperty({
    description:
      'the url of the link the base Url should be displayed on the ui',
    example: 'gdg.sba',
    required: true,
  })
  @IsString()
  @IsUrl({}, { message: 'url must be a valid URL' })
  url: string;
}

export class CreateLocationDto {
  @ApiProperty({
    description: 'the name of the organization location',
    example: 'Sidi Bel Abbes, Algeria',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'the country of the organization',
    example: 'Algeria',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    description: 'the city of the organization',
    example: 'Sidi Bel Abbes',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  mapsLink?: string;
}

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'name of the organization',
    example: 'Google developers Group Sba',
    required: true,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;

  @ApiProperty({
    description: 'the university the organization is associated with',
    example: 'Esi Sidi Bel Abbes ',
    required: false,
  })
  @IsOptional()
  @IsString()
  university?: string;

  @ApiProperty({
    description: 'a description of a bio for the organization',
    example: 'We are a group of developers who love to code',
    required: true,
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'links of the organization',
    type: [CreateLinkDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLinkDto)
  links: CreateLinkDto[];

  @ApiProperty({
    description: 'location of the organization',
    type: CreateLocationDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => CreateLocationDto)
  location: CreateLocationDto;
}
