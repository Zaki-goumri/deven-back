import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hackathon {
  @PrimaryGeneratedColumn('increment')
  id: number;
}
