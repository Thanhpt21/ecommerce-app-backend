import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class VariantSizeUpdateItemDto {
    @IsNumber()
    @Type(() => Number) // Đảm bảo chuyển đổi sang số
    sizeId: number;

    @IsNumber()
    @Type(() => Number) // Đảm bảo chuyển đổi sang số
    quantity: number;
}

export class UpdateVariantDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number) // Thêm @Type cho price
  price?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number) // Thêm @Type cho discount
  discount?: number;

  @IsString()
  @IsOptional()
  thumb?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @Type(() => Number) 
  colorId?: number;

  @IsOptional()
    @IsArray({ message: 'variantSizes phải là một mảng.' }) // Validate là một mảng
    @ValidateNested({ each: true, message: 'Mỗi phần tử trong variantSizes phải là một đối tượng hợp lệ.' }) // Validate các đối tượng lồng nhau
    @Type(() => VariantSizeUpdateItemDto) // Chỉ định kiểu DTO cho các phần tử mảng
    @Transform(({ value }) => {
        // Xử lý khi dữ liệu được gửi từ FormData dưới dạng chuỗi JSON
        if (typeof value === 'string' && value.length > 0) {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    // Chuyển đổi các plain object thành instance của VariantSizeUpdateItemDto
                    return parsed.map(item => plainToInstance(VariantSizeUpdateItemDto, item));
                }
                return value; // Trả về nguyên bản nếu không phải mảng sau khi parse
            } catch (e) {
                console.error('Lỗi khi parse chuỗi variantSizes JSON:', e);
                return value; // Trả về giá trị gốc nếu có lỗi parse
            }
        }
        // Xử lý khi dữ liệu đã là một mảng (ví dụ: từ JSON body)
        if (Array.isArray(value)) {
            return value.map(item => plainToInstance(VariantSizeUpdateItemDto, item));
        }
        return value; // Trả về nguyên bản nếu không phải chuỗi cũng không phải mảng
    })
    variantSizes?: VariantSizeUpdateItemDto[];

}