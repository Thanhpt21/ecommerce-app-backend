import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateShippingAddressDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  ward?: string;

  @IsString()
  @IsOptional()
  district?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
