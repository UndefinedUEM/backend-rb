import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'O código deve ter exatamente 4 dígitos.' })
  code: string;
}
