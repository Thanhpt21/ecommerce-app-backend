// src/products/dto/create-product.dto.ts

import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WeightUnit } from '../enums/product.enums'; // Đảm bảo đường dẫn đúng

// Thêm một DTO mới cho từng cặp sizeId và quantity
export class ProductSizeDto {
    @IsInt()
    @Type(() => Number)
    sizeId: number;

    @IsInt()
    @IsOptional() // Có thể tùy chọn nếu bạn muốn quantity mặc định là 0 ở backend
    @Type(() => Number)
    quantity?: number; // Số lượng cho size này
}

export class CreateProductDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    code: string;

    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @Type(() => Number)
    discount: number;

    @IsString()
    @IsOptional()
    status?: string;

    @IsArray()
    @Type(() => String)
    tags: string[];

    @IsOptional()
    @Type(() => Number)
    brandId?: number;

    @IsOptional()
    @Type(() => Number)
    categoryId?: number;

    @IsOptional()
    @Type(() => Number)
    colorId?: number;

    @IsOptional()
    @IsString()
    thumb?: string;

    // Thay thế sizeIds bằng một mảng các đối tượng ProductSizeDto
    @IsString() // Thay đổi kiểu dữ liệu dự kiến thành string
    @IsOptional()
    productSizes?: string; // Sẽ là chuỗi JSON từ formData

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    weight?: number;

    @IsString()
    @IsOptional()
    @IsEnum(WeightUnit)
    weightUnit?: WeightUnit;

    @IsString()
    @IsOptional()
    unit?: string;
}