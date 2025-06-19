import { WeightUnit } from '../enums/product.enums';
export declare class ProductSizeUpdateItemDto {
    sizeId: number;
    quantity: number;
}
export declare class UpdateProductDto {
    title?: string;
    slug?: string;
    description?: string;
    code?: string;
    price?: number;
    discount?: number;
    status?: string;
    tags?: string[];
    brandId?: number;
    categoryId?: number;
    colorId?: number;
    thumb?: string;
    images?: string[];
    productSizes?: ProductSizeUpdateItemDto[];
    weight?: number;
    weightUnit?: WeightUnit;
    unit?: string;
}
