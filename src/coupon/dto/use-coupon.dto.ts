import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class UseCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  orderValue: number;
}
