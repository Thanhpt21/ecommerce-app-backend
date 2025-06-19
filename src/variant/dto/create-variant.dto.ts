import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class VariantSizeDto {
    @IsNumber() // Đảm bảo sizeId là số
    @IsNotEmpty() // sizeId không được rỗng
    @Type(() => Number) // Chuyển đổi thành kiểu số
    sizeId: number;

    @IsNumber() // Đảm bảo quantity là số
    @IsOptional() // Quantity có thể không bắt buộc (nếu có mặc định 0 ở backend)
    @Type(() => Number) // Chuyển đổi thành kiểu số
    quantity?: number; // Số lượng tồn kho cho size này của biến thể
}


export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  title: string;

    @IsNumber()
  @Type(() => Number) // Thêm @Type cho price
  price: number;

  @IsNumber()
  @Type(() => Number) // Thêm @Type cho discount
  discount: number;

  @IsString()
  @IsOptional()
  thumb?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsNotEmpty() // productId không được rỗng
  productId: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number) // Thêm @Type cho colorId
  colorId?: number;

   @IsString() // Kiểu dữ liệu dự kiến là string
  @IsOptional()
  variantSizes?: string; // Sẽ là chuỗi JSON từ formData, ví dụ: '[{"sizeId":1,"quantity":10},{"sizeId":2,"quantity":5}]'
}
