import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class AddModeratorDto {
  @ApiProperty({
    example: [2, 3, 4],
    description: 'Array of user IDs to be added as moderators',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Min(1, { each: true })
  usersIds: number[];
}
