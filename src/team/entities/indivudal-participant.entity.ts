import { ApiProperty } from '@nestjs/swagger';
import { Hackathon } from 'src/hackathon/entities/hackathon.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/*
 * Represents an individual participant in a hackathon.
 * They are registered as independent users and can later be invited to teams.
 */
@Entity('individual_participants')
export class IndividualParticipant {
  @ApiProperty({
    description: 'Unique identifier of the individual participant',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'The user who is participating in the hackathon',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({
    description: 'The ID of the user participating',
    example: 42,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'The hackathon in which the participant is registered',
    type: () => Hackathon,
  })
  @ManyToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;

  @ApiProperty({
    description: 'The ID of the hackathon',
    example: 7,
  })
  @Column()
  hackathonId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
