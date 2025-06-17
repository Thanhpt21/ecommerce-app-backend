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
                id: number;
                createdAt: Date;
                updatedAt: Date;
                expiresAt: Date;
                title: string;
                code: string;
                discount: number;
                usageLimit: number;
                usedCount: number;
                minOrderValue: number;
            } | null;
            shipping: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                provinceName: string;
                fee: number;
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
                    thumb: string;
                    price: number;
                    sold: number;
                    status: string;
                    averageRating: number;
                    ratingCount: number;
                    tags: string[];
                    images: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    colorId: number | null;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                } | null;
                variant: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    discount: number;
                    thumb: string;
                    price: number;
                    images: string[];
                    colorId: number | null;
                    productId: number;
                    sku: string;
                } | null;
            } & {
                id: number;
                discount: number;
                price: number;
                colorId: number | null;
                productId: number | null;
                sizeId: number | null;
                quantity: number;
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
            shippingFee: number | null;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            shippingAddressId: number;
            couponId: number | null;
            shippingId: number | null;
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
            shipping: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                provinceName: string;
                fee: number;
            } | null;
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
            shipping: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                provinceName: string;
                fee: number;
            } | null;
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
    findOne(id: string, user: UserResponseDto): Promise<{
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
            shipping: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                provinceName: string;
                fee: number;
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
                price: number;
                colorId: number | null;
                productId: number | null;
                sizeId: number | null;
                quantity: number;
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
            shippingFee: number | null;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            shippingAddressId: number;
            couponId: number | null;
            shippingId: number | null;
        };
    }>;
    update(id: string, dto: UpdateOrderDto): Promise<{
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
                    thumb: string;
                    price: number;
                    sold: number;
                    status: string;
                    averageRating: number;
                    ratingCount: number;
                    tags: string[];
                    images: string[];
                    brandId: number | null;
                    categoryId: number | null;
                    colorId: number | null;
                    weight: number;
                    weightUnit: string;
                    unit: string;
                } | null;
                variant: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    discount: number;
                    thumb: string;
                    price: number;
                    images: string[];
                    colorId: number | null;
                    productId: number;
                    sku: string;
                } | null;
            } & {
                id: number;
                discount: number;
                price: number;
                colorId: number | null;
                productId: number | null;
                sizeId: number | null;
                quantity: number;
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
            shippingFee: number | null;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            shippingAddressId: number;
            couponId: number | null;
            shippingId: number | null;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            discountAmount: number;
            status: string;
            userId: number;
            shippingFee: number | null;
            paymentMethod: string;
            note: string | null;
            totalAmount: number;
            finalAmount: number;
            cancelReason: string | null;
            shippingAddressId: number;
            couponId: number | null;
            shippingId: number | null;
        };
    }>;
}
