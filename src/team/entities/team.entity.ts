import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
  @ApiProperty({
    description: 'Unique identifier of the team',
    example: 1,
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'Hackathon this team belongs to',
    type: () => Hackathon,
  })
  @ManyToOne(() => Hackathon)
  @JoinColumn({ name: 'hackathonId' })
  hackathon: Hackathon;

  @ApiProperty({
    description: 'Foreign key of the hackathon',
    example: 3,
  })
  @Column()
  hackathonId: number;

  @ApiProperty({
    description: 'Name of the team',
    example: 'CodeMasters',
    maxLength: 10,
  })
  @Column({ type: 'varchar', length: 10 })
  name: string;

  @ApiProperty({
    description: 'Unique code for the team (used for joining)',
    example: 'AB12CD34',
    maxLength: 8,
  })
  @Exclude()
  @Column({ type: 'char', length: 8, unique: true })
  code: string;

  @ApiProperty({
    description: 'Optional description of the team',
    example: 'We build cool AI projects',
    nullable: true,
    maxLength: 50,
  })
  @Column({ type: 'varchar', length: 50, nullable: true })
  description: string | null;

  @ApiProperty({
    description: 'User who own the team',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @ApiProperty({
    description: 'ID of the owner (foreign key to user)',
    example: 7,
  })
  @Column()
  ownerId: number;

  @ApiProperty({
    description: 'Date when the team was created',
    example: '2025-08-29T10:15:30.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the team was last updated',
    example: '2025-08-29T12:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
