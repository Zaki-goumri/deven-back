import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const ATTACHMENT_TYPE = {
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  DOCUMENT: 'document',
} as const;

export type AttachmentType =
  (typeof ATTACHMENT_TYPE)[keyof typeof ATTACHMENT_TYPE];

export const ATTACHMENT_UPLOAD_STATUS = {
  PENDING: 'pending',
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type AttachmentUploadStatus =
  (typeof ATTACHMENT_UPLOAD_STATUS)[keyof typeof ATTACHMENT_UPLOAD_STATUS];

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // Job id from BullMQ
  @Column({ unique: true, nullable: true, type: 'text' })
  jobId: string | null;
  @Column({ nullable: true, unique: true })
  url?: string;
  @Column({ type: 'enum', enum: ATTACHMENT_TYPE })
  type: AttachmentType;
  @Column({
    type: 'enum',
    enum: ATTACHMENT_UPLOAD_STATUS,
    default: ATTACHMENT_UPLOAD_STATUS.PENDING,
  })
  status: AttachmentUploadStatus;
  @Column()
  filename: string;
  @Column()
  size: number;
  @Column({ type: 'text', nullable: true })
  errorMessage?: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
