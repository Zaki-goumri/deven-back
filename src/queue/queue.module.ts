import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { AppConfig } from 'src/config/interfaces/app-config.interface';
import { MailProcessor } from './mail/mail.processor';
import { EmailModule } from 'src/email/email.module';

@Global()
@Module({
  imports: [
    EmailModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<AppConfig['redis']['host']>(
          'redis.host',
          'localhost',
        );
        const redisPort = configService.get<AppConfig['redis']['port']>(
          'redis.port',
          6379,
        );
        const redisUrl = `redis://${redisHost}:${redisPort}`;
        return {
          connection: {
            host: redisHost,
            port: redisPort,
            url: redisUrl,
            db: 3, // Default database
          },
        };
      },

      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      ...Object.values(QUEUE_NAME).map((queueName) => ({
        name: queueName,
      })),
    ),
  ],

  exports: [BullModule],
  providers: [MailProcessor],
})
export class QueueModule {}
