import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(dto: CreateOrderDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            coupon: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                discount: number;
                title: string;
                code: string;
                expiresAt: Date;
                usageLimit: number;
                usedCount: number;
                minOrderValue: number;
            } | null;
            shippingAddress: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
                fullName: string;
                phone: string;
                address: string;
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
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    title: string;
                } | null;
                color: {
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    title: string;
                    code: string;
                } | null;
                product: {
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    price: number;
                    discount: number;
                    colorId: number | null;
                    title: string;
                    code: string;
                    slug: string;
                    description: string;
                    thumb: string;
                    sold: number;
                    averageRating: number;
                    ratingCount: number;
                    tags: string[];
                    images: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                } | null;
                variant: {
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    price: number;
                    discount: number;
                    productId: number;
                    colorId: number | null;
                    title: string;
                    thumb: string;
                    images: string[];
                    sku: string;
                } | null;
            } & {
                id: number;
                price: number;
                discount: number;
                quantity: number;
                productId: number | null;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                orderId: number;
            })[];
        } & {
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
            ghtkCodAmount: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
        };
    }>;
    findAll(page: number | undefined, limit: number | undefined, search: string | undefined, user: UserResponseDto, statusFilter?: string, paymentMethodFilter?: string): Promise<{
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
                userId: number;
                fullName: string;
                phone: string;
                address: string;
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
    findOrdersByUser(req: any, page?: number, limit?: number): Promise<{
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
                userId: number;
                fullName: string;
                phone: string;
                address: string;
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
    findOne(id: string, user: UserResponseDto): Promise<{
        success: boolean;
        message: string;
        data: {
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
            shippingAddress: {
                id: number;
                userId: number;
                fullName: string;
                phone: string;
                address: string;
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
                price: number;
                discount: number;
                quantity: number;
                productId: number | null;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                orderId: number;
            })[];
        } & {
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
            ghtkCodAmount: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
        };
    }>;
    update(id: string, dto: UpdateOrderDto): Promise<{
        success: boolean;
        message: string;
        data: {
            shippingAddress: {
                createdAt: Date;
                updatedAt: Date;
                id: number;
                userId: number;
                fullName: string;
                phone: string;
                address: string;
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
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    title: string;
                } | null;
                product: {
                    status: string;
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    price: number;
                    discount: number;
                    colorId: number | null;
                    title: string;
                    code: string;
                    slug: string;
                    description: string;
                    thumb: string;
                    sold: number;
                    averageRating: number;
                    ratingCount: number;
                    tags: string[];
                    images: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                } | null;
                variant: {
                    createdAt: Date;
                    updatedAt: Date;
                    id: number;
                    price: number;
                    discount: number;
                    productId: number;
                    colorId: number | null;
                    title: string;
                    thumb: string;
                    images: string[];
                    sku: string;
                } | null;
            } & {
                id: number;
                price: number;
                discount: number;
                quantity: number;
                productId: number | null;
                variantId: number | null;
                sizeId: number | null;
                colorId: number | null;
                orderId: number;
            })[];
        } & {
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
            ghtkCodAmount: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    cancelOrder(orderId: string, dto: CancelOrderDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
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
            ghtkCodAmount: import("@prisma/client/runtime/library").Decimal | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            userId: number;
            shippingAddressId: number;
            couponId: number | null;
        };
    }>;
}
