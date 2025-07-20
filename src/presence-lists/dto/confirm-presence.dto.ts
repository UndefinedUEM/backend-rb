import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmPresenceDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty({ message: 'A lista de IDs de escoteiros não pode ser vazia.' })
  scoutIds: number[];
}
