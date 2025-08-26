import { ApiProperty } from '@nestjs/swagger';
import { Location } from 'src/common/entitiies/location.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Organization {
  @ApiProperty({
    name: 'organization id ',
    description: 'a unique id for each organization',
  })
  @PrimaryGeneratedColumn('increment')
  id: string;
  @ApiProperty({
    name: 'Organization name',
    description: 'name of the organization',
  })
  @Column({ type: 'varchar', unique: true, length: 20 })
  name: string;
  @ApiProperty({
    name: 'description of organization',
    description: 'a description of a bio for the organization',
  })
  @Column({ type: 'varchar', length: 1000 })
  description: string;
  @ApiProperty({
    name: 'isVerified',
    description:
      'check if is it a verified organization or not by sending an attchements to admin',
  })
  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
  @ApiProperty({
    name: 'id of location',
    description: 'id of location record in location table',
  })
  @OneToOne(() => Location, { nullable: false })
  @JoinColumn({ name: 'locationId' })
  location: Location;
  @ApiProperty({
    name: 'owner id',
    description: 'id of the owner',
  })
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  Owner: User;
  @ApiProperty({
    name: 'creator id',
    description: 'id of creator in user table',
  })
  @OneToOne(() => User, { nullable: true }) //user deleted we can remove the colum not too neccessary
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @ApiProperty({
    name: 'creation time',
  })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ApiProperty({
    name: 'last updating time',
  })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  //profilepic
  //cover page

  //create a join table for followers
  @ManyToMany(() => User)
  @JoinTable({
    name: 'organization_followers',
    joinColumn: {
      name: 'organizationId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'followerId',
      referencedColumnName: 'id',
    },
  })
  followers: User[];
}
