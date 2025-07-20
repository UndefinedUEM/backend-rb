import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateScoutDto {
  @IsNumber()
  @IsNotEmpty({ message: 'O ID do escoteiro não pode ser vazio.' })
  id: number;

  @IsString()
  @IsNotEmpty({ message: 'O nome do escoteiro não pode ser vazio.' })
  name: string;
}
