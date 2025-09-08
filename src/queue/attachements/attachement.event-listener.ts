import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadApiResponse } from 'cloudinary';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { Attachment } from 'src/common/entities/attachement.entity';
import { Repository } from 'typeorm';

@QueueEventsListener(QUEUE_NAME.ATTACHMENTS)
export class AttachmentEventListener extends QueueEventsHost {
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
    await this.attachmentRepo.update(
      { jobId },
      {
        status: 'failed',
        errorMessage: failedReason,
      },
    );
  }
}
