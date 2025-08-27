import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hackathon } from './hackathon.entity';

@Entity()
export class hackathonPrizing {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Hackathon)
  hackathon: Hackathon;

  @Column({ type: 'tinyint' })
  classement: number;

  @Column({ type: 'mediumint' })
  amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateAt: Date;
}
