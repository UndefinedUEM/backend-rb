import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { id, email, password } = createUserDto;

    const existingUserById = await this.usersRepository.findOneBy({ id });
    if (existingUserById) {
      throw new ConflictException(`O ID '${id}' já está em uso.`);
    }

    const existingUserByEmail = await this.usersRepository.findOneBy({ email });
    if (existingUserByEmail) {
      throw new ConflictException(`O e-mail '${email}' já está em uso.`);
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usersRepository.save(newUser);
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ id });
    return user || undefined;
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneBy({ email });
    return user || undefined;
  }
}
