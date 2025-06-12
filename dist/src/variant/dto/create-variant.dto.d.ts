export declare class CreateVariantDto {
    title: string;
    price: number;
    discount: number;
    thumb?: string;
    images?: string[];
    sku?: string;
    productId: number;
    colorId?: number;
    sizeIds?: number[] | string;
}
