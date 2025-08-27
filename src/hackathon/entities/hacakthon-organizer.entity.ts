import { User } from 'src/user/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Hackathon } from './hackathon.entity';

@Entity()
export class HackthonOrganizer {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedBy' })
  assigner: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
