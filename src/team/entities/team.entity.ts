import { Hackathon } from 'src/hackathon/entities/hackathon.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
  @Column({ type: 'char', length: 8 })
  code: string;

  @Column({ type: 'varchar', length: 50 })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
