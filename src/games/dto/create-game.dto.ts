// create-game.dto.ts
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  genre!: string;

  @IsInt()
  @Min(0)
  price!: number;
}
