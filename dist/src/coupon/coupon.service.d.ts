import { PrismaService } from 'prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findOne(id: number): Promise<{
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
    update(id: number, dto: UpdateCouponDto): Promise<{
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
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    useCoupon(code: string, orderValue: number): Promise<{
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
    incrementCouponUsage(couponId: number): Promise<boolean>;
}
