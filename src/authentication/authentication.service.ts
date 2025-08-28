import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareHash } from 'src/common/utils/authentication/bcrypt.utils';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthResponseDto } from './dtos/responses/auth-response.dto';
import { registerDto } from './dtos/requests/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { Queue } from 'bullmq';
import { MAIL_JOBS } from 'src/common/constants/jobs';
import { RegisterResponseDto } from './dtos/responses/register-response.dto';
import { VerifyMailReqDto } from './dtos/requests/verifiy-mail-req.dto';
import { AuthConfig } from 'src/config/interfaces/auth-config.interface';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import { Profile as GithubProfile } from 'passport-github2';
import { AccessTokenPayload } from './interfaces/access-token-payload.interface';

@Injectable()
export class AuthenticationService {
  logger = new Logger(AuthenticationService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    @InjectQueue(QUEUE_NAME.MAIL) private readonly mailQueue: Queue,
  ) {}

  async sendVerificationEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    if (user.isEmailVerified) {
      throw new ConflictException('Email is already verified');
    }
    const code = await this.generateVerificationCode(email);
    await this.mailQueue.add(MAIL_JOBS.SEND_VERIFICATION_MAIL, {
      to: email,
      code: code,
      name: user.username,
    });
    return {
      message: 'Verification email sent successfully',
    };
  }
  async verifiyEmail({ code, email }: VerifyMailReqDto) {
    const key = AuthenticationService.getVerificationKey(email);
    const storedCode = await this.redisService.get(key, 'persistent');
    if (!code || storedCode !== code) {
      throw new BadRequestException(
        'Unauthorized. Invalid or expired verification code provided.',
      );
    }
    await this.userService.updateUserByEmail(email, {
      isEmailVerified: true,
    });
    return {
      message: 'Email verified successfully',
    };
  }

  async logOauthUser(user: GoogleProfile | GithubProfile) {
    const existingUser = await this.userService.findByEmail(
      user.emails![0].value,
    );

    if (existingUser) {
      return existingUser;
    }

    const newUser = await this.userService.createOauthUser(user);
    //send welcome email
    await this.mailQueue.add(MAIL_JOBS.SEND_WELCOME_MAIL, {
      to: newUser.email,
    });
    return newUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    if (!user.password) {
      throw new UnauthorizedException('Oauth User cannot login with password');
    }
    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
  //Private method that is the only place to create verification codes for users

  private async generateVerificationCode(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = AuthenticationService.getVerificationKey(email);
    // Store the code in Redis with a TTL of 10 minutes (600 seconds)
    await this.redisService.set(key, code, 600, 'persistent');
    return code;
  }

  async issueTokens(user: User): Promise<AuthResponseDto> {
    try {
      const { id, email } = user;
      const accessTokenPayload: AccessTokenPayload = { sub: id, user: user };
      const refreshTokenPayload = { sub: id, email, type: 'refresh' };

      const jwtConfig = this.configService.get<AuthConfig['jwt']>('auth.jwt')!;

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(accessTokenPayload, {
          expiresIn: jwtConfig.accessTokenExpiresIn,
          secret: jwtConfig.accessTokenSecret,
        }),
        this.jwtService.signAsync(refreshTokenPayload, {
          expiresIn: jwtConfig.refreshTokenExpiresIn,
          secret: jwtConfig.refreshTokenSecret,
        }),
      ]);
      return {
        accessToken,
        refreshToken,
        user: user,
      };
    } catch (error) {
      this.logger.error('Error issuing tokens', error);
      throw new BadRequestException('Failed to issue tokens');
    }
  }
  async registerUser(data: registerDto): Promise<RegisterResponseDto> {
    const user = await this.userService.createUser(data);

    if (!user.isEmailVerified) {
      if (user.provider == null) {
        const code = await this.generateVerificationCode(user.email);
        await this.mailQueue.add(MAIL_JOBS.SEND_VERIFICATION_MAIL, {
          to: user.email,
          code: code,
          name: user.username,
        });
      }
    }
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
        provider: user.provider,
      },
    };
  }
  static getVerificationKey(email: string) {
    return `verify-auth:${email}`;
  }
}
