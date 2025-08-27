import { Organization } from 'src/organization/entities/organization.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class VerficationDemand {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @OneToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column()
  @Index()
  oragnizationId: number;

  @Column({ type: 'text' })
  content: string;
  @Column({ type: 'boolean', nullable: true })
  isApproved: boolean;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  //attchement
}
