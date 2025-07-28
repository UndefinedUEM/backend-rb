import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Scout } from '../../scouts/entities/scout.entity';

@Entity('presence_lists')
export class PresenceList {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Scout)
  @JoinTable({
    name: 'presence_list_scouts',
    joinColumn: { name: 'presence_list_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'scout_id', referencedColumnName: 'id' },
  })
  confirmedScouts: Scout[];
}
