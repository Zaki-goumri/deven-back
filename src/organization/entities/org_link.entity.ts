import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { Organization } from 'src/organization/entities/organization.entity';
import { LinkProvider } from 'src/common/entities/link-provider.entity';

// ReadMe important note :
// On the first approach the engineer(me) was going to use a polymorphic relation to handle links in all entities , however this was proven to be a bad idea .
// first Typeorm does not support it natively and it will be hard to manage in the future .
// if you decide to do it anyways you will have a hard tradoff you need to make , more io time vs more cpu time.
// both of them are bad, you will have more cpu time if you use an left join and then filter entity type based on your need
// and you will have more io time if you do multiple queries to fetch links for each entity type.
// second indexing will be harder to manage and you will have a big table with many rows that will be hard to index and query.
// There was also a consideration to use a view table but their readonly nature in most databases and added complexity made us disregard this choice
// so the final decision was to create a separate table for each entity type that needs links.
// This also comes with its sets of challenges including migration management and bloated schema but this is the most scalable approach since we tune and index each independently based on the  entity needs.
// So currently we will have organization_links , hackathon_links, user_links.
@Entity('organization_links')
export class OrganizationLink {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  url: string;
  // Relation with LinkProvider
  @JoinColumn()
  @ManyToOne(() => LinkProvider, { eager: true })
  provider: LinkProvider;
  @ManyToOne(() => Organization, (organization) => organization.id, {
    onDelete: 'CASCADE',
  })
  organization: Relation<Organization>;
}
