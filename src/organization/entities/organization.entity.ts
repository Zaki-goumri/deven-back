import { ApiProperty } from '@nestjs/swagger';
import { Location } from 'src/common/entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationLink } from './org_link.entity';

@Entity()
export class Organization {
  @ApiProperty({
    description: 'a unique id for each organization',
  })
  @PrimaryGeneratedColumn('increment')
  id: number;
  @ApiProperty({
    description: 'name of the organization',
  })
  @Column({ type: 'varchar', unique: true, length: 40 })
  name: string;
  @ApiProperty({
    description: 'a description of a bio for the organization',
  })
  @Column({ type: 'varchar', length: 1000 })
  description: string;
  @ApiProperty({
    description:
      'check if is it a verified organization or not by sending an attchements to admin',
  })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
  @ApiProperty({
    description: 'id of location record in location table',
  })
  @OneToOne(() => Location, { nullable: false, cascade: true })
  @JoinColumn({ name: 'locationId' })
  location: Location;
  @ApiProperty({
    description: 'id of the owner',
  })
  //TODO: are we sure this is a one to one ?can't the user have multiple organizations
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  Owner: Relation<User>;
  @ApiProperty({
    description: 'id of creator in user table',
  })
  @OneToOne(() => User, { nullable: true }) //user deleted we can remove the colum not too neccessary
  @JoinColumn({ name: 'createdBy' })
  createdBy: Relation<User>;

  @ApiProperty({
    description: 'The University to which the club is associated',
    required: false,
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  university: string | null;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({})
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  //profilepic
  //cover page

  //create a join table for followers
  @ManyToMany(() => User, (user) => user.followedOrganizations)
  @JoinTable({
    name: 'organization_followers',
    joinColumn: {
      name: 'organizationId',
    },
    inverseJoinColumn: {
      name: 'followerId',
    },
  })
  followers: Relation<User>[];
  @OneToMany(() => OrganizationLink, (link) => link.organization, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  link: OrganizationLink[];
  @ManyToMany(() => User, (user) => user.moderatedOrganizations, {
    cascade: true,
  })
  @JoinTable()
  moderators: Relation<User>[];
}
