import { IsOptional, IsString } from 'class-validator';

export class CreateConfigDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() mobile?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() googlemap?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() zalo?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() tiktok?: string;
  @IsOptional() @IsString() youtube?: string;
  @IsOptional() @IsString() x?: string;
  @IsOptional() @IsString() linkedin?: string;
  @IsOptional() @IsString() logo?: string;
  @IsOptional() @IsString() pick_province?: string;
  @IsOptional() @IsString() pick_district?: string;
  @IsOptional() @IsString() pick_ward?: string;
  @IsOptional() @IsString() pick_address?: string;
}
