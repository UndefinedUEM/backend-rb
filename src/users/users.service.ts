import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // Injeta o "repositório" do usuário, que nos permite acessar a tabela 'users'
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Método para criar um novo usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Criptografa a senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    // Cria a nova entidade de usuário com a senha criptografada
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Salva o novo usuário no banco de dados
    return this.usersRepository.save(newUser);
  }

  // Método para encontrar um usuário pelo e-mail (usaremos no login)
  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user || undefined;
  }

  // Método para encontrar um usuário pelo ID (usaremos nas rotas protegidas)
  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ id });
    return user || undefined;
  }
}
