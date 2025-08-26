import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/app.config';
import { AppConfig } from './config/interfaces/app-config.interface';
import { QUEUE_NAME } from './common/constants/queues';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { QueueModule } from './queue/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsModule } from './settings/settings.module';
import { HackathonModule } from './hackathon/hackathon.module';
import { VerificationModule } from './verification/verification.module';
import { OrganizationModule } from './organization/organization.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { TeamModule } from './team/team.module';
import { AdminModule } from './admin/admin.module';
import { AchivenemntsModule } from './achivenemnts/achivenemnts.module';
import databaseConfig from './config/database.config';
@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseConfig.asProvider()),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          limit: 100, // Maximum number of requests
          ttl: 60, // Time to live in seconds
          blockDuration: 10, // Block duration in seconds
          ignoreUserAgents: [/^curl\//i], // Ignore requests from curl user agent
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration available globally
      validationSchema: null, // You can define a Joi schema here for validation if needed
      load: [appConfig],
    }),
    AuthenticationModule,
    UserModule,
    HealthModule,
    QueueModule,
    SettingsModule,
    HackathonModule,
    VerificationModule,
    OrganizationModule,
    WhatsappModule,
    TeamModule,
    AdminModule,
    AchivenemntsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
