import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  price: number;

  @IsNumber()
  discount: number;

  @IsString()
  @IsOptional()
  thumb?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  productId: number;

  @IsNumber()
  @IsOptional()
  colorId?: number;

  @IsOptional()
  @IsArray()
  sizeIds?: number[] | string;
}
