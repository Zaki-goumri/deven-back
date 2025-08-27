import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Icon } from './icon.entity';

@Entity()
export class Achivenemnt {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @OneToOne(() => Icon)
  @JoinColumn({ name: 'iconId' })
  icon: Icon;

  @Column({ type: 'varchar', length: 20 })
  title: string;

  @Column({ type: 'varchar', length: 40 })
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
