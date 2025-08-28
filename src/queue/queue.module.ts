import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { MailProcessor } from './mail/mail.processor';
import { EmailModule } from 'src/email/email.module';
import { AppConfig } from 'src/config/interfaces/app-config.interface';
import redisConfig from 'src/config/redis.config';

@Global()
@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
    EmailModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof redisConfig>) => {
        const redisHost = configService.host;
        const redisPort = configService.port;
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

      inject: [redisConfig.KEY],
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
