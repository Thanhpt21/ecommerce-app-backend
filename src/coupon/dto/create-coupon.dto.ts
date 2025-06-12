import {
  IsString, IsNotEmpty, IsNumber, IsDateString, Min,
  IsOptional
} from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  discount: number;

  @IsDateString()
  expiresAt: string;

  @IsNumber()
  @Min(1)
  usageLimit: number;

  @IsNumber()
  @Min(0)
  minOrderValue: number;

  @IsOptional()
  @IsNumber()
  useCount?: number;
}
