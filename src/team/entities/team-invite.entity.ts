import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class TeamInvite {
  @ApiProperty({
    description: 'Unique identifier of the invite',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'The user receiving the invite',
    type: () => User,
  })
  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'The team linked to the invite',
    type: () => Team,
  })
  @OneToOne(() => Team, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Relation<Team>;

  @ApiProperty({
    description: 'ID of the team that sent the invite',
    example: 42,
  })
  @Column()
  teamId: number;

  @ApiProperty({
    description: 'Message or content attached to the invite',
    maxLength: 100,
    example: 'You have been invited to join Team Alpha!',
  })
  @Column({ type: 'varchar', length: 100 })
  content: string;

  @ApiProperty({
    description: 'invitation to join team',
    nullable: true,
  })
  @Column({ type: 'boolean', nullable: true })
  isAccepted: boolean | null;
}
