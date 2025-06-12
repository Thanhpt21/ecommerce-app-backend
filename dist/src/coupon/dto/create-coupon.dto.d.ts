export declare class CreateCouponDto {
    title: string;
    code: string;
    discount: number;
    expiresAt: string;
    usageLimit: number;
    minOrderValue: number;
    useCount?: number;
}
