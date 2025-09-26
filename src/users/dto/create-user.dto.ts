import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Branch } from 'src/common/enums/branch.enum';
import { Role } from 'src/common/enums/role.enum';

export class CreateUserDto {
  @IsNumber({}, { message: 'O ID deve ser um número' })
  @IsNotEmpty({ message: 'O ID não pode ser vazio' })
  id: number;

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

  @IsEnum(Role, { message: 'O tipo de função fornecido é inválido.' })
  @IsNotEmpty({ message: 'O tipo de função não pode ser vazio.' })
  role: Role;

  @IsEnum(Branch, { message: 'A seção fornecida é inválida.' })
  @IsNotEmpty({ message: 'A seção fornecida não pode ser vazia.' })
  branch: Branch;
}
