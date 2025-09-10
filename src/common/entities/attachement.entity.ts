import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  ATTACHMENT_TYPE,
  AttachmentType,
} from '../types/attachement/attachament-type.type';
import {
  ATTACHMENT_UPLOAD_STATUS,
  AttachmentUploadStatus,
} from '../types/attachement/attachemt-status.type';

@Entity({ name: 'attachments' })
export class Attachement {
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
