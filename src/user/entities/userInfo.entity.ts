import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Location } from 'src/common/entitiies/location.entity';

@Entity('user_infos')
export class UserInfo {
  @ApiProperty({
    description: 'The unique identifier of the user info',
    example: '5',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({
    description: 'A short bio of the user',
    example: 'I am a software engineer',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  aboutMe: string;

  @ApiProperty({
    description: 'The birthday of the user',
    example: '1990-01-01',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @ApiProperty({
    description: 'The skills of the user',
    example: ['nestjs', 'typescript'],
    required: false,
  })
  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @ApiProperty({
    description: 'The id of the location of the user',
    example: '',
  })
  @Column({ type: 'number', nullable: true })
  locationId: number | null;


  @ApiProperty({
    description: 'The date and time the user info was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the user info was last updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    description: 'Location info of the user',
    type: () => Location,
  })
  @ManyToOne(() => Location, (location) => location.usersInfo)
  @JoinColumn({ name: 'locationId' })
  location: Location | null;
}
