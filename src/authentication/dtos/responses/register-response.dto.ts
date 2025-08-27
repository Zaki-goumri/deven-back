import { ApiProperty, PartialType } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';

export class RegisterResponseDto {
  @ApiProperty()
  message: string;
  @ApiProperty({ type: () => PartialType(User) })
  user: Partial<User>;
}
