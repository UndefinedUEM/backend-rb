import { Branch } from 'src/common/enums/branch.enum';
import { Role } from 'src/common/enums/role.enum';
import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    enum: Role,
  })
  role: Role;

  @Column({
    enum: Branch,
  })
  branch: Branch;

  @CreateDateColumn()
  createdAt: Date;
}
