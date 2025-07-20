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

  @CreateDateColumn() // Salva automaticamente a data e hora da criação
  createdAt: Date;

  // Define a relação Muitos-para-Muitos
  @ManyToMany(() => Scout)
  @JoinTable({
    name: 'presence_list_scouts', // Nome da tabela de junção que será criada
    joinColumn: { name: 'presence_list_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'scout_id', referencedColumnName: 'id' },
  })
  confirmedScouts: Scout[];
}
