import { IsInt, IsOptional, IsString, Min } from 'class-validator';

// If this field exists → validate it
export class UpdateGameDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;


  @IsOptional() // makes the field optional
  @IsInt() // makes the field an integer
  @Min(0) // makes the field a minimum of 0
  price?: number; //This property may or may not exist in the request body
}
