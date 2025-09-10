import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { TeamModule } from './team/team.module';
import { HackathonModule } from './hackathon/hackathon.module';
import { OrganizationModule } from './organization/organization.module';
import { SettingsModule } from './settings/settings.module';
import { AdminModule } from './admin/admin.module';
import { VerificationModule } from './verification/verification.module';
import { EmailModule } from './email/email.module';
import mailConfig from './config/mail.config';
import { QueueModule } from './queue/queue.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { AchivenemntsModule } from './achivenemnts/achivenemnts.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import redisConfig from './config/redis.config';
import { FiltersModule } from './global/exception-filters/filter.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, mailConfig, authConfig, redisConfig],
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    UserModule,
    AuthenticationModule,
    TeamModule,
    HackathonModule,
    OrganizationModule,
    SettingsModule,
    AdminModule,
    VerificationModule,
    EmailModule,
    QueueModule,
    RedisModule,
    HealthModule,
    WhatsappModule,
    AchivenemntsModule,
    CloudinaryModule,
    FiltersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
