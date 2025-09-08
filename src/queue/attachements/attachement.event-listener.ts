import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse } from 'cloudinary';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { Attachment } from 'src/common/entities/attachement.entity';
import { Repository } from 'typeorm';

@QueueEventsListener(QUEUE_NAME.ATTACHMENTS)
export class AttachmentEventListener extends QueueEventsHost {
  logger = new Logger(AttachmentEventListener.name);
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepo: Repository<Attachment>,
  ) {
    super();
  }
  @OnQueueEvent('completed')
  async onCompleted({
    jobId,
    returnvalue,
  }: {
    jobId: string;
    returnvalue: UploadApiResponse;
  }) {
    this.logger.log(`Job with ID ${jobId} has been completed.`);
    //Mark upload as completed in DB
    await this.attachmentRepo.update(
      { jobId },
      {
        status: 'completed',
        url: returnvalue.secure_url,
      },
    );
  }
  @OnQueueEvent('added')
  async onAdded({ jobId }: { jobId: string }) {
    this.logger.log(`Job with ID ${jobId} has been added to the queue.`);

    await this.attachmentRepo.update(
      { jobId },
      {
        status: 'uploading',
      },
    );
  }
  @OnQueueEvent('failed')
  async onFailed({
    jobId,
    failedReason,
  }: {
    jobId: string;
    failedReason: string;
  }) {
    //Mark upload as failed in DB
    this.logger.error(
      `Job with ID ${jobId} has failed. Reason: ${failedReason}`,
    );
    await this.attachmentRepo.update(
      { jobId },
      {
        status: 'failed',
        errorMessage: failedReason,
      },
    );
  }
}
