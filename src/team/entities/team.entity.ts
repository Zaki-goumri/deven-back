import { Hackathon } from 'src/hackathon/entities/hackathon.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;

  @Column({ type: 'varchar', length: 10 })
  name: string;

  @Column({ type: 'char', length: 8, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  description: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
