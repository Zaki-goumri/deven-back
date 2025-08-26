import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Location } from 'src/common/entitiies/location.entity';

@Entity('user_infos')
export class UserInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  aboutMe: string;

  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ type: 'simple-array', nullable: true })
  skills: string[];

  @Column({ type: 'varchar', length: 255 })
  locationId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // One-to-one relationship with User entity
  @OneToOne(() => User, (user) => user.info)
  user: User;

  @ManyToOne(() => Location, (location) => location.usersInfo)
  @JoinColumn({ name: 'locationId' })
  location: Location;
}
