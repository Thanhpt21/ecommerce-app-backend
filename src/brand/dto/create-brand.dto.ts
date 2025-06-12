import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  image?: string;
}
