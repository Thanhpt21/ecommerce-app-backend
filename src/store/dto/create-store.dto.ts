import { IsString, IsOptional } from 'class-validator';

export class CreateStoreDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  address: string;

  @IsString()
  mobile: string;

  @IsString()
  link: string;

  @IsString()
  iframe: string;
}
