import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('scouts')
export class Scout {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;
}
