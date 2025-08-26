import { Entity, PrimaryGeneratedColumn } from 'typeorm';

Entity();
export class Icon {
  @PrimaryGeneratedColumn('increment')
  id: number; //add only id for now
}
