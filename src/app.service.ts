import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QUEUE_NAME } from './common/constants/queues';
import { Queue } from 'bullmq';
import { UploadFileDto } from './queue/attachements/dtos/upload-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './common/entities/attachement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue(QUEUE_NAME.ATTACHMENTS) private attachmentQueue: Queue,
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {}
  async uploadImage(file: Express.Multer.File) {
    const payload: UploadFileDto = {
      file,
      options: {
        uploadType: 'USER',
      },
    };
    const job = await this.attachmentQueue.add('upload_file', payload, {
      removeOnComplete: true,
      removeOnFail: true,
    });
    await this.attachmentRepo.save({
      jobId: job.id,
      filename: file.originalname,
      status: 'pending',
      type: 'document',
      size: file.size,
    });
    return {
      message: 'File upload initiated',
      jobId: job.id,
    };
  }
  getHello(): string {
    return 'welcome to deven backend';
  }
}
