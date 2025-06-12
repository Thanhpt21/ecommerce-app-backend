import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
} from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string; 

  @IsOptional()
  @IsString()
  slug?: string; 

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  colorId?: number;

  @IsOptional()
  @IsString()
  thumb?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  })
  sizeIds?: number[];
}
