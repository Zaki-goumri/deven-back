import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HackathonPeriodTag } from './hackathon-period-tag.entity';
import { Hackathon } from './hackathon.entity';

@Entity()
export class HackathonPeriod {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'time' })
  startTime: Date;

  @Column({ type: 'time' })
  endTime: Date;

  @Column()
  title: string;
  @Column()
  description: string;

  @ManyToOne(() => HackathonPeriodTag)
  @JoinColumn({ name: 'periodTagId' })
  tag: HackathonPeriodTag;

  @ManyToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;
}
