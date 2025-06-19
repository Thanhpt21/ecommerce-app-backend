export declare class VariantSizeUpdateItemDto {
    sizeId: number;
    quantity: number;
}
export declare class UpdateVariantDto {
    title?: string;
    price?: number;
    discount?: number;
    thumb?: string;
    images?: string[];
    colorId?: number;
    variantSizes?: VariantSizeUpdateItemDto[];
}
