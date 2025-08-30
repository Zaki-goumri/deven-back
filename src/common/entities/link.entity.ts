import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LinkProvider } from './link-provider.entity';

export const EntityTypeEnum = {
  USER: 'user',
  HACKATHON: 'hackathon',
  ORGANIZATION: 'organization',
} as const;
export type EntityType = (typeof EntityTypeEnum)[keyof typeof EntityTypeEnum];
@Entity()
export class Link {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  url: string;
  @Column()
  entityId: number;
  @Column({
    type: 'enum',
    enum: EntityTypeEnum,
  })
  entityType: EntityType;
  // Relation with LinkProvider
  @JoinColumn()
  @ManyToOne(() => LinkProvider, { eager: true })
  provider: LinkProvider;
}
