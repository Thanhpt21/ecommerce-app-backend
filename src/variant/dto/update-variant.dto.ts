import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsString()
  @IsOptional()
  thumb?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsOptional()
  colorId?: number;

  @IsOptional()
  @IsArray()
  sizeIds?: number[] | string;

}