import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
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
  @ApiProperty({
    description: 'Unique identifier of the team member record',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'The team this member belongs to',
    type: () => Team,
  })
  @OneToOne(() => Team, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @ApiProperty({
    description: 'ID of the team this member belongs to',
    example: 42,
  })
  @Column()
  teamId: number;

  @ApiProperty({
    description: 'The user who is a member of the team',
    type: () => User,
  })
  @OneToOne(() => User)
  @JoinColumn({ name: 'memberId' })
  member: User;

  @ApiProperty({
    description: 'ID of the user who is a member of the team',
    example: 7,
  })
  @Column()
  memberId: number;

  @ApiProperty({
    description: 'Date when this record was created',
    example: '2025-08-29T10:15:30.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when this record was last updated',
    example: '2025-08-29T12:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
