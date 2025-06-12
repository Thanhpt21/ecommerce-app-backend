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
    sizeIds: number[];
}
