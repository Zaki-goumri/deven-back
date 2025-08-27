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

  @Column({ type: 'varchar' })
  locationId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Location, (location) => location.usersInfo)
  @JoinColumn({ name: 'locationId' })
  location: Location;
}
