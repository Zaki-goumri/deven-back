import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { USER } from 'src/authentication/decorators/user.decorartor';
import { User } from './entities/user.entity';
import { AccessTokenGuard } from 'src/authentication/guards/access-token.guard';

@Controller('user')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  @ApiOperation({ summary: 'Get current logged on user details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the details of the currently logged-in user.',
    type: () => User, // Replace with actual User DTO if available
  })
  @Get('me')
  getCurrentUser(@USER('id') id: number) {
    return this.userService.findById(id);
  }
}
