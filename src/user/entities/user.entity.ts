import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserProvider, UserProviderType } from '../types/use-provider.type';
import { UserInfo } from './userInfo.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'varchar' })
  infoId: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  userName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  // Hashed password,[nullable for OAuth users]
  password?: string;

  @Column({
    type: 'enum',
    enum: UserProvider,
  })
  provider: UserProviderType;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'boolean', default: false })
  isFirstLogin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => UserInfo)
  @JoinColumn({ name: 'infoId' }) // Specify the column name
  info: UserInfo;
}
