import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hackathon } from './hackathon.entity';
import { SPONSOR_TIER_VALUES, sponsorTier } from '../types/tier.enum';

@Entity()
export class HackathonSponsor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 10 })
  type: string;

  @Column({ type: 'varchar', length: 15 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  description: string;

  @ManyToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;
  //logo
  @Column({ type: 'enum', enum: SPONSOR_TIER_VALUES })
  tier: sponsorTier;
}
