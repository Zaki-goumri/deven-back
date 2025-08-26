import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Achivenemnt } from 'src/achivenemnts/entities/achivenemnt.entity';
import { Hackathon } from 'src/hackathon/entities/hackathon.entity';

@Entity()
export class UserAchivement {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Achivenemnt)
  @JoinColumn({ name: 'achivenemntId' })
  achivement: Achivenemnt;

  @OneToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;

  @CreateDateColumn({ type: 'timestamp' })
  awardedAt: Date;
}
