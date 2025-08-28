import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LocalGuard } from './guards/local.guard';
import { USER } from './decorators/user.decorartor';
import { User } from 'src/user/entities/user.entity';
import { registerDto } from './dtos/requests/register.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { LoginDto } from './dtos/requests/login.dto';
import { RegisterResponseDto } from './dtos/responses/register-response.dto';
import { VerifyMailReqDto } from './dtos/requests/verifiy-mail-req.dto';
import { GoogleGuard } from './guards/oauth/google.guard';
import { GithubGuard } from './guards/oauth/github.guard';
import { Response } from 'express';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Logs in a user and issues access and refresh tokens.',
  })
  @ApiBody({
    type: () => LoginDto,
  })
  @ApiOkResponse({
    description: 'Returns the access token, refresh token, and user details.',
    type: () => AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials provided.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body is invalid or missing required fields.',
  })
  async login(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }
  @ApiOperation({
    summary: 'Register user',
    description: 'Registers a new user and issues access and refresh tokens.',
  })
  @ApiOkResponse({
    description: 'Returns the access token, refresh token, and user details.',
    type: () => RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body is invalid or missing required fields.',
  })
  @Post('register')
  async register(@Body() data: registerDto): Promise<RegisterResponseDto> {
    return this.authenticationService.registerUser(data);
  }
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Refreshes access and refresh tokens using a valid refresh token.',
  })
  @ApiOkResponse({
    description: 'Returns the new access token and refresh token.',
    type: () => AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid refresh token provided.',
  })
  async refreshTokens(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }
  @ApiOperation({
    summary: 'Verify email',
    description:
      'Verifies a user email using a verification code sent to the email address.',
  })
  @ApiOkResponse({
    description: 'Email verified successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body is invalid or missing required fields.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid or expired verification code provided.',
  })
  @Post('verify-mail')
  async verifyEmail(@Body() data: VerifyMailReqDto) {
    return this.authenticationService.verifiyEmail(data);
  }
  @Post('send-verification-code')
  @ApiOperation({
    summary: 'Send verification code',
    description:
      'Sends a verification code to the specified email address for email verification.',
  })
  @ApiOkResponse({
    description: 'Verification email sent successfully.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request body is invalid or missing required fields.',
  })
  @ApiResponse({
    status: 404,
    description: 'User with this email does not exist',
  })
  @ApiResponse({
    status: 409,
    description: 'User Email is already verified',
  })
  async sendVerificationCode(@Body('email') email: string) {
    return this.authenticationService.sendVerificationEmail(email);
  }
  //the docuemntion below shall reflect that this get will redirect the user to complete the oauth flow
  @ApiOperation({
    summary: 'Google OAuth2 login',
    description: 'Initiates the Google OAuth2 login flow.',
  })
  @UseGuards(GoogleGuard)
  @Get('oauth/google')
  googleAuth(@Res() res: Response) {
    res.redirect('/authentication/oauth/github/callback');
    return;
  }

  @UseGuards(GoogleGuard)
  @Post('oauth/google/callback')
  googleAuthRedirect(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }

  @UseGuards(GithubGuard)
  @Get('oauth/github')
  githubAuth(@Res() res: Response) {
    res.redirect('/authentication/oauth/github/callback');
  }
  githubAuthRedirect() {
    return;
  }
  @Post('oauth/github/callback')
  @UseGuards(GithubGuard)
  githubAuthCallback(@USER() user: User) {
    return this.authenticationService.issueTokens(user);
  }
}
