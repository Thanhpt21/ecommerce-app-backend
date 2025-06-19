import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { UseCouponDto } from './dto/use-coupon.dto';
export declare class CouponController {
    private readonly couponService;
    constructor(couponService: CouponService);
    create(dto: CreateCouponDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date;
            title: string;
            code: string;
            discount: number;
            usageLimit: number;
            minOrderValue: number;
            usedCount: number;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date;
            title: string;
            code: string;
            discount: number;
            usageLimit: number;
            minOrderValue: number;
            usedCount: number;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date;
            title: string;
            code: string;
            discount: number;
            usageLimit: number;
            minOrderValue: number;
            usedCount: number;
        };
    }>;
    update(id: string, dto: UpdateCouponDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            expiresAt: Date;
            title: string;
            code: string;
            discount: number;
            usageLimit: number;
            minOrderValue: number;
            usedCount: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    useCoupon(dto: UseCouponDto): Promise<{
        success: boolean;
        message: string;
        discountAmount?: undefined;
        couponId?: undefined;
    } | {
        success: boolean;
        message: string;
        discountAmount: number;
        couponId: number;
    }>;
}
