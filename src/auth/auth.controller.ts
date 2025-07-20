import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth') // Garante o prefixo /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('cadastro') // Garante o final /cadastro
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
