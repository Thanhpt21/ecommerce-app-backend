export interface VariantSizeDetail {
    variantId: number; // ID của biến thể mà kích thước này thuộc về
    sizeId: number;    // ID của kích thước (ví dụ: ID của 'S', 'M', 'L')
    title: string;     // Tên của kích thước (ví dụ: 'S', 'M', 'L')
    quantity: number;  // Số lượng biến thể có kích thước này
}