import { IsOptional, IsString, IsBoolean, IsPhoneNumber } from 'class-validator';
import { Type } from 'class-transformer'; // Import Type from class-transformer

export class UpdateShippingAddressDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean) 
  isDefault?: boolean;
}