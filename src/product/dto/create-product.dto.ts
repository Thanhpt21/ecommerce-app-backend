import { IsArray, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  code: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  discount: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsArray()
  @Type(() => String)
  tags: string[];

  @IsOptional()
  @Type(() => Number)
  brandId?: number;

  @IsOptional()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  colorId?: number;

  @IsOptional()
  @IsString()
  thumb?: string;

  @IsArray()
  @IsInt({ each: true })
  sizeIds: number[];

}
