import { IsOptional, IsString, IsBoolean, IsPhoneNumber } from 'class-validator';

export class UpdateShippingAddressDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsPhoneNumber('VN') // hoặc 'ZZ' nếu bạn muốn kiểm tra nhẹ
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
  isDefault?: boolean;
}
