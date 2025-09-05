import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for displaying user information.
 * This is the object that will be used across pages where we need to display a list of users then allow clicking on them
 * to go to their profile page.
 * It contains only the necessary fields to minimize data transfer and enhance performance.
 **/
export class DisplayUserDto {
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;
  @ApiProperty({ example: 'johndoe', description: 'The username of the user' })
  username: string;
  @ApiProperty({
    example: { firstName: 'John', lastName: 'Doe' },
    description: 'Basic information about the user',
  })
  info: {
    firstName: string;
    lastName: string;
    //avatarUrl: string;
  };
}
