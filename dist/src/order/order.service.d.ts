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
            shippingAddress: {
                id: number;
                address: string;
                createdAt: Date;
                updatedAt: Date;
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
            coupon: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                discount: number;
                title: string;
                code: string;
                expiresAt: Date;
                usageLimit: number;
                usedCount: number;
                minOrderValue: number;
            } | null;
            items: ({
                product: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: string;
                    colorId: number | null;
                    price: number;
                    discount: number;
                    title: string;
                    thumb: string;
                    images: string[];
                    slug: string;
                    description: string;
                    code: string;
                    sold: number;
                    averageRating: number;
                    ratingCount: number;
                    tags: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                } | null;
                variant: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: number;
                    colorId: number | null;
                    price: number;
                    discount: number;
                    title: string;
                    thumb: string;
                    images: string[];
                    sku: string;
                } | null;
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
            } & {
                id: number;
                orderId: number;
                productId: number | null;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                quantity: number;
                price: number;
                discount: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
            shippingFee: number | null;
            orderCode: string;
            status: string;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            discountAmount: number;
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
            orderCode: string;
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
                discount: number;
                code: string;
                expiresAt: Date;
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
            coupon: {
                id: number;
                discount: number;
                code: string;
                expiresAt: Date;
                usageLimit: number;
                usedCount: number;
            } | null;
            items: ({
                product: {
                    id: number;
                    color: {
                        id: number;
                        title: string;
                        code: string;
                    } | null;
                    title: string;
                    thumb: string;
                    slug: string;
                } | null;
                variant: {
                    id: number;
                    color: {
                        id: number;
                        title: string;
                        code: string;
                    } | null;
                    title: string;
                    thumb: string;
                } | null;
                size: {
                    id: number;
                    title: string;
                } | null;
            } & {
                id: number;
                orderId: number;
                productId: number | null;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                quantity: number;
                price: number;
                discount: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
            shippingFee: number | null;
            orderCode: string;
            status: string;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            discountAmount: number;
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
                address: string;
                createdAt: Date;
                updatedAt: Date;
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
                product: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    status: string;
                    colorId: number | null;
                    price: number;
                    discount: number;
                    title: string;
                    thumb: string;
                    images: string[];
                    slug: string;
                    description: string;
                    code: string;
                    sold: number;
                    averageRating: number;
                    ratingCount: number;
                    tags: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                } | null;
                variant: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    productId: number;
                    colorId: number | null;
                    price: number;
                    discount: number;
                    title: string;
                    thumb: string;
                    images: string[];
                    sku: string;
                } | null;
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                } | null;
            } & {
                id: number;
                orderId: number;
                productId: number | null;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                quantity: number;
                price: number;
                discount: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
            shippingFee: number | null;
            orderCode: string;
            status: string;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            discountAmount: number;
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
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
            shippingFee: number | null;
            orderCode: string;
            status: string;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            discountAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            ghtkLabel: string | null;
            ghtkStatus: string | null;
            ghtkTrackingUrl: string | null;
            ghtkCodAmount: Prisma.Decimal | null;
        };
    }>;
}
