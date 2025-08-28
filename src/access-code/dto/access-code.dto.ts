import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'O código deve ter exatamente 4 dígitos.' })
  code: string;
}

export class RequestCodeDto {
  @IsEmail({}, { message: 'Por favor, insira um formato de e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;
}
