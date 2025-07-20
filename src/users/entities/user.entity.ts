import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') // Diz ao TypeORM que esta classe é uma tabela chamada 'users'
export class User {
  @PrimaryGeneratedColumn() // Define 'id' como a chave primária auto-incrementada
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) // Define uma coluna 'email' que deve ser única
  email: string;

  @Column() // Define uma coluna 'password'
  password: string;

  @CreateDateColumn() // Define uma coluna que salva a data de criação automaticamente
  createdAt: Date;
}
