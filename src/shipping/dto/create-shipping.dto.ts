import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateShippingDto {
  @IsString()
  @IsNotEmpty()
  provinceName: string;

  @IsInt()
  @Min(0)
  fee: number;
}