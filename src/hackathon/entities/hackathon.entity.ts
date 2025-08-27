import { Tag } from 'src/common/entities/tag.entity';
import { Location } from 'src/common/entities/location.entity';
import { Organization } from 'src/organization/entities/organization.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Hackathon {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 30 })
  title: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column({ type: 'datetime' })
  registrationDate: Date;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @OneToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'locationId' })
  location: Location;

  //cover page
  //logo id

  @Column({ type: 'varchar', length: 50 })
  overview: string;

  @Column({ type: 'tinyint', unsigned: true })
  minInTeam: number;

  @Column({ type: 'tinyint', unsigned: true })
  maxInTeam: number;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  maxOfTeams: number;

  @Column({ default: false })
  isExternal: boolean;

  @Column({ default: false })
  isOnline: true;

  @OneToOne(() => User)
  @JoinColumn({ name: 'createdBy' })
  creator: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Tag)
  @JoinTable({
    name: 'hackathonTag',
    joinColumn: {
      name: 'hackathonId',
    },
    inverseJoinColumn: {
      name: 'tagId',
    },
  })
  tags: Tag[];
}
