import { WeightUnit } from '../enums/product.enums';
export declare class ProductSizeDto {
    sizeId: number;
    quantity?: number;
}
export declare class CreateProductDto {
    title: string;
    description: string;
    code: string;
    price: number;
    discount: number;
    status?: string;
    tags: string[];
    brandId?: number;
    categoryId?: number;
    colorId?: number;
    thumb?: string;
    productSizes?: string;
    weight?: number;
    weightUnit?: WeightUnit;
    unit?: string;
}
