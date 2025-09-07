import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE_NAME } from 'src/common/constants/queues';

@Processor(QUEUE_NAME.ATTACHMENTS)
export class AttachmentsProcessor extends WorkerHost  {
    process(job: Job, token?: string): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
