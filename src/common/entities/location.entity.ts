import { ApiProperty } from '@nestjs/swagger';
import { UserInfo } from '../../user/entities/userInfo.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('locations')
export class Location {
  @ApiProperty({
    description: 'The unique identifier of the location',
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ApiProperty({
    description: 'The name of the location',
    example: 'Epitech',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @ApiProperty({
    description: 'The city of the location',
    example: 'Paris',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  //Unique so we can upsert later
  @ApiProperty({
    description: 'The Google Maps link of the location',
    example: 'https://maps.app.goo.gl/xxxxxxxxxxxx',
  })
  @Column({ type: 'text', unique: true })
  mapsLink: string;

  @ApiProperty({
    description: 'The date and time the location was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the location was last updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // One-to-many relationship with UserInfos
  @OneToMany(() => UserInfo, (userInfo) => userInfo.location)
  usersInfo: UserInfo[];
  //TODO:add hackathons and organizations relation
}
