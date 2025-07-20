import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Lógica de Cadastro (Sign Up)
  async signUp(createUserDto: CreateUserDto) {
    // Verifica se o e-mail já existe
    const existingUser = await this.usersService.findOneByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const user = await this.usersService.create(createUserDto);

    // Nunca retorne a senha, mesmo que criptografada
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  // Lógica de Login (Sign In)
  async signIn(email: string, pass: string): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);

    // Verifica se o usuário existe e se a senha está correta
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Se tudo estiver certo, gera e retorna o token JWT
    const payload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
