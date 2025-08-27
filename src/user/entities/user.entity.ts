import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  OneToOne,
} from 'typeorm';
import { UserProvider, UserProviderType } from '../types/use-provider.type';
import { UserInfo } from './userInfo.entity';

// Enum for provider types

@Entity('users')
@Index(['username'], { unique: true })
@Index(['email'], { unique: true })
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '1',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({
    description: 'The unique identifier of the user info',
    example: '5',
  })
  @Column({ type: 'varchar', nullable: true })
  infoId: number | null;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'johndoe@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({})
  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean = false;
  @ApiProperty({
    description: 'The hashed password of the user',
    example: '$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    required: false,
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  // Hashed password,[nullable for OAuth users]
  password: string | null;

  @ApiProperty({
    description: 'The provider of the user',
    example: 'google',
    enum: UserProvider,
  })
  @Column({
    type: 'enum',
    enum: UserProvider,
    nullable: true,
  })
  provider: UserProviderType | null;

  @ApiProperty({
    description: 'Whether the user is an admin',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Whether it is the first login of the user',
    example: false,
  })
  @Column({ type: 'boolean', default: false })
  isFirstLogin: boolean = false;

  @ApiProperty({
    description: 'The date and time the user was created',
    example: '2021-01-01T00:00:00.000Z',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time the user was last updated',
    example: '2021-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ApiProperty({
    description: 'The user info associated with the user',
    type: () => UserInfo,
  })
  @OneToOne(() => UserInfo)
  @JoinColumn({ name: 'infoId' }) // Specify the column name
  info: UserInfo;
}
