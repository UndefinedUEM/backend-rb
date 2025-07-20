import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    // AQUI ESTÁ A CORREÇÃO:
    const secret = configService.get<string>('JWT_SECRET');

    // Adicionamos uma verificação para falhar com uma mensagem clara
    if (!secret) {
      throw new Error(
        'Segredo JWT (JWT_SECRET) não foi encontrado. Verifique seu arquivo .env',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret, // Agora temos certeza que 'secret' é uma string
    });
  }

  async validate(payload: { sub: number; name: string }) {
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido.');
    }

    return { userId: user.id, name: user.name, email: user.email };
  }
}
