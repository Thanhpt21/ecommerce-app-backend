import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
