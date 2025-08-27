import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class TeamMember {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @OneToOne(() => User)
  @JoinColumn({ name: 'memberId' })
  member: User;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
