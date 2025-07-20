import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @IsEmail({}, { message: 'O formato do e-mail é inválido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
