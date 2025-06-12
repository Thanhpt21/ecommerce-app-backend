import { IsOptional, IsInt, IsString, Min, Max } from 'class-validator';

export class UpdateRatingDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  star?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
