import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsInt,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { WeightUnit } from '../enums/product.enums';

export class ProductSizeUpdateItemDto {
  @IsNumber()
  @Type(() => Number) // Đảm bảo chuyển đổi sang số
  sizeId: number;

  @IsNumber()
  @Type(() => Number) // Đảm bảo chuyển đổi sang số
  quantity: number;
}


export class UpdateProductDto {
  @IsOptional()
  @IsString()
  title?: string; 

  @IsOptional()
  @IsString()
  slug?: string; 

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  discount?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  brandId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  colorId?: number;

  @IsOptional()
  @IsString()
  thumb?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

@IsOptional()
  @IsArray({ message: 'productSizes phải là một mảng.' })
  @ValidateNested({ each: true, message: 'Mỗi phần tử trong productSizes phải là một đối tượng hợp lệ.' })
  @Type(() => ProductSizeUpdateItemDto) // ⭐ Vẫn giữ nguyên, nó cần cho Validator lồng nhau ⭐
  @Transform(({ value }) => {

    if (typeof value === 'string' && value.length > 0) {
      try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
          // ⭐ THAY ĐỔI QUAN TRỌNG: BIẾN ĐỔI PLAIN OBJECTS THÀNH INSTANCES CỦA DTO ⭐
          return parsed.map(item => plainToInstance(ProductSizeUpdateItemDto, item));
        }
        return value;
      } catch (e) {
        console.error('Lỗi khi parse chuỗi productSizes JSON:', e);
        return value;
      }
    }
    // Nếu value đã là một mảng (có thể đã được plainToInstance ở một nơi khác,
    // hoặc đây là dữ liệu không phải từ form-data mà là JSON body),
    // hãy đảm bảo nó cũng được biến đổi thành instance.
    if (Array.isArray(value)) {
        return value.map(item => plainToInstance(ProductSizeUpdateItemDto, item));
    }
    return value;
  })
  productSizes?: ProductSizeUpdateItemDto[];


  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  weight?: number; // Giá trị khối lượng
  
  @IsString()
  @IsOptional()
  @IsEnum(WeightUnit) // Đảm bảo weightUnit là một trong các giá trị của WeightUnit enum
  weightUnit?: WeightUnit; // Đơn vị của khối lượng (ví dụ: 'gram', 'kg')
  
  @IsString()
  @IsOptional() // Có thể để tùy chọn, hoặc bỏ nếu bạn muốn nó là bắt buộc
  unit?: string; // Đơn vị tính của sản phẩm (ví dụ: "cái", "chiếc", "bộ", "hộp")
}
