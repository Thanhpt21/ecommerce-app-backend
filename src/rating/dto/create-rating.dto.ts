import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;

  @IsString()
  comment: string;

  @IsInt()
  productId: number;
}
