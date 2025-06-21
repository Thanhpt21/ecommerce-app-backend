import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { GhtkService } from 'src/ghtk/ghtk.service';
export declare class OrderService {
    private readonly prisma;
    private ghtkService;
    private readonly logger;
    constructor(prisma: PrismaService, ghtkService: GhtkService);
    create(dto: CreateOrderDto, userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            coupon: {
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
            } | null;
            shippingAddress: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                address: string;
                userId: number;
                fullName: string;
                phone: string;
                ward: string | null;
                district: string | null;
                province: string | null;
                wardId: number | null;
                districtId: number | null;
                provinceId: number | null;
                isDefault: boolean;
            };
            items: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                } | null;
                color: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    code: string;
                } | null;
                product: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    slug: string;
                    code: string;
                    discount: number;
                    description: string;
                    price: number;
                    status: string;
                    tags: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    colorId: number | null;
                    thumb: string;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                    images: string[];
                    sold: number;
                    averageRating: number;
                    ratingCount: number;
                } | null;
                variant: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    discount: number;
                    price: number;
                    colorId: number | null;
                    thumb: string;
                    images: string[];
                    productId: number;
                    sku: string;
                } | null;
            } & {
                id: number;
                discount: number;
                sizeId: number | null;
                quantity: number;
                price: number;
                colorId: number | null;
                productId: number | null;
                variantId: number | null;
                orderId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            discountAmount: number;
            status: string;
            userId: number;
            paymentMethod: string;
            shippingAddressId: number;
            shippingFee: number | null;
            note: string | null;
            couponId: number | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            ghtkLabel: string | null;
            ghtkStatus: string | null;
            ghtkTrackingUrl: string | null;
            ghtkCodAmount: Prisma.Decimal | null;
        };
    }>;
    findAll(userId: any, page?: number, limit?: number, search?: string, statusFilter?: string, paymentMethodFilter?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
            status: string;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            discountAmount: number;
            finalAmount: number;
            createdAt: Date;
            updatedAt: Date;
            items: {
                id: number;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                quantity: number;
                price: number;
                discount: number;
                product: {
                    id: number;
                    title: string;
                    slug: string;
                    thumb: string;
                    color: {
                        id: number;
                        title: string;
                        code: string;
                    } | null;
                } | null;
                variant: {
                    id: number;
                    title: string;
                    thumb: string;
                } | null;
                size: {
                    id: number;
                    title: string;
                } | null;
            }[];
            shippingAddress: {
                id: number;
                address: string;
                userId: number;
                fullName: string;
                phone: string;
                ward: string | null;
                district: string | null;
                province: string | null;
            };
            user: {
                email: string;
            };
            shippingFee: number | null;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findOrdersByUser(userId: number, page?: number, limit?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
            status: string;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            discountAmount: number;
            finalAmount: number;
            createdAt: Date;
            updatedAt: Date;
            items: {
                id: number;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                quantity: number;
                price: number;
                discount: number;
                product: {
                    id: number;
                    title: string;
                    slug: string;
                    thumb: string;
                    color: {
                        id: number;
                        title: string;
                        code: string;
                    } | null;
                } | null;
                variant: {
                    id: number;
                    title: string;
                    thumb: string;
                } | null;
                size: {
                    id: number;
                    title: string;
                } | null;
            }[];
            shippingAddress: {
                id: number;
                address: string;
                userId: number;
                fullName: string;
                phone: string;
                ward: string | null;
                district: string | null;
                province: string | null;
            };
            user: {
                email: string;
            };
            coupon: {
                id: number;
                expiresAt: Date;
                code: string;
                discount: number;
                usageLimit: number;
                usedCount: number;
            } | null;
            shippingFee: number | null;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                email: string;
            };
            coupon: {
                id: number;
                expiresAt: Date;
                code: string;
                discount: number;
                usageLimit: number;
                usedCount: number;
            } | null;
            shippingAddress: {
                id: number;
                address: string;
                userId: number;
                fullName: string;
                phone: string;
                ward: string | null;
                district: string | null;
                province: string | null;
            };
            items: ({
                size: {
                    id: number;
                    title: string;
                } | null;
                product: {
                    color: {
                        id: number;
                        title: string;
                        code: string;
                    } | null;
                    id: number;
                    title: string;
                    slug: string;
                    thumb: string;
                } | null;
                variant: {
                    color: {
                        id: number;
                        title: string;
                        code: string;
                    } | null;
                    id: number;
                    title: string;
                    thumb: string;
                } | null;
            } & {
                id: number;
                discount: number;
                sizeId: number | null;
                quantity: number;
                price: number;
                colorId: number | null;
                productId: number | null;
                variantId: number | null;
                orderId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            discountAmount: number;
            status: string;
            userId: number;
            paymentMethod: string;
            shippingAddressId: number;
            shippingFee: number | null;
            note: string | null;
            couponId: number | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            ghtkLabel: string | null;
            ghtkStatus: string | null;
            ghtkTrackingUrl: string | null;
            ghtkCodAmount: Prisma.Decimal | null;
        };
    }>;
    update(id: number, dto: UpdateOrderDto): Promise<{
        success: boolean;
        message: string;
        data: {
            shippingAddress: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                address: string;
                userId: number;
                fullName: string;
                phone: string;
                ward: string | null;
                district: string | null;
                province: string | null;
                wardId: number | null;
                districtId: number | null;
                provinceId: number | null;
                isDefault: boolean;
            };
            items: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                } | null;
                product: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    slug: string;
                    code: string;
                    discount: number;
                    description: string;
                    price: number;
                    status: string;
                    tags: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    colorId: number | null;
                    thumb: string;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                    images: string[];
                    sold: number;
                    averageRating: number;
                    ratingCount: number;
                } | null;
                variant: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    discount: number;
                    price: number;
                    colorId: number | null;
                    thumb: string;
                    images: string[];
                    productId: number;
                    sku: string;
                } | null;
            } & {
                id: number;
                discount: number;
                sizeId: number | null;
                quantity: number;
                price: number;
                colorId: number | null;
                productId: number | null;
                variantId: number | null;
                orderId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            discountAmount: number;
            status: string;
            userId: number;
            paymentMethod: string;
            shippingAddressId: number;
            shippingFee: number | null;
            note: string | null;
            couponId: number | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            ghtkLabel: string | null;
            ghtkStatus: string | null;
            ghtkTrackingUrl: string | null;
            ghtkCodAmount: Prisma.Decimal | null;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    cancelOrder(orderId: string, userId: string, dto: CancelOrderDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            discountAmount: number;
            status: string;
            userId: number;
            paymentMethod: string;
            shippingAddressId: number;
            shippingFee: number | null;
            note: string | null;
            couponId: number | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            ghtkLabel: string | null;
            ghtkStatus: string | null;
            ghtkTrackingUrl: string | null;
            ghtkCodAmount: Prisma.Decimal | null;
        };
    }>;
    private incrementCouponUsage;
}
