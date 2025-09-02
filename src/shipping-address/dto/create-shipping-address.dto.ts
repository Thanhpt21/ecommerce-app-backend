import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateShippingAddressDto {
  @IsInt() // Đảm bảo userId là số nguyên
  @IsNotEmpty() // Đảm bảo userId không rỗng
  @Type(() => Number) // Chuyển đổi userId sang kiểu số khi nhận từ request body
  userId: number;

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
  @Type(() => Boolean) // Chuyển đổi isDefault sang kiểu boolean
  isDefault?: boolean;
}