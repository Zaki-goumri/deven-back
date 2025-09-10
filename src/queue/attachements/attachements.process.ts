import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { UploadFileDto } from './dtos/upload-file.dto';

import { ATTACHMENTS_JOBs } from 'src/common/constants/jobs';
import { UploadApiResponse } from 'cloudinary';
@Processor(QUEUE_NAME.ATTACHMENTS)
export class AttachmentsProcessor extends WorkerHost {
  constructor(private readonly cloudService: CloudinaryService) {
    super();
  }
  process(job: Job<UploadFileDto>): Promise<UploadApiResponse> {
    switch (job.name) {
      case ATTACHMENTS_JOBs.UPLOAD_FILE:
        return this.cloudService.uploadFile(job.data.file, job.data.options);
      default:
        return Promise.reject(new Error('Unknown job name'));
    }
  }
}
