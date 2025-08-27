import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HackathonPeriodTag {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 10 })
  color: string;

  @Column({ type: 'varchar', length: 40 })
  content: string;
}
