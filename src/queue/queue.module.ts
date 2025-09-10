import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { ConfigModule,  ConfigType } from '@nestjs/config';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { MailProcessor } from './mail/mail.processor';
import { EmailModule } from 'src/email/email.module';
import redisConfig from 'src/config/redis.config';
import { AttachmentsProcessor } from './attachements/attachements.process';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachement } from 'src/common/entities/attachement.entity';
import { AttachmentEventListener } from './attachements/attachement.event-listener';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Attachement]),
    ConfigModule.forFeature(redisConfig),
    EmailModule,
    CloudinaryModule,
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
  providers: [MailProcessor, AttachmentsProcessor, AttachmentEventListener],
})
export class QueueModule {}
