import { UserInfo } from 'src/user/entities/userInfo.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  //Unique so we can upsert later
  @Column({ type: 'text', unique: true })
  mapsLink: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // One-to-many relationship with UserInfos
  @OneToMany(() => UserInfo, (userInfo) => userInfo.location)
  usersInfo: UserInfo[];
  //TODO:add hackathons and organizations relation
}
