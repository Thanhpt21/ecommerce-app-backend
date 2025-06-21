"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ghtk_service_1 = require("../ghtk/ghtk.service");
const order_enums_1 = require("./enums/order.enums");
let OrderService = OrderService_1 = class OrderService {
    prisma;
    ghtkService;
    logger = new common_1.Logger(OrderService_1.name);
    constructor(prisma, ghtkService) {
        this.prisma = prisma;
        this.ghtkService = ghtkService;
    }
    async create(dto, userId) {
        const order = await this.prisma.$transaction(async (tx) => {
            const { items, status, paymentMethod, shippingAddressId, note, couponId, shippingFee } = dto;
            const finalStatus = status || order_enums_1.OrderStatus.PENDING;
            const finalPaymentMethod = paymentMethod || order_enums_1.PaymentMethod.COD;
            const enrichedItems = await Promise.all(items.map(async (item) => {
                let productData;
                if (item.variantId) {
                    const variant = await tx.variant.findUnique({
                        where: { id: item.variantId },
                        select: { price: true, discount: true, productId: true },
                    });
                    if (!variant)
                        throw new common_1.NotFoundException(`Variant with ID ${item.variantId} not found.`);
                    productData = { price: variant.price, discount: variant.discount };
                }
                else if (item.productId) {
                    const product = await tx.product.findUnique({
                        where: { id: item.productId },
                        select: { price: true, discount: true },
                    });
                    if (!product)
                        throw new common_1.NotFoundException(`Product with ID ${item.productId} not found.`);
                    productData = { price: product.price, discount: product.discount };
                }
                else {
                    throw new common_1.BadRequestException('Order item must have either productId or variantId.');
                }
                return {
                    ...item,
                    price: productData.price,
                    discount: productData.discount,
                };
            }));
            let totalAmount = 0;
            let productDiscountAmount = 0;
            for (const item of enrichedItems) {
                totalAmount += item.price * item.quantity;
                productDiscountAmount += (item.discount ?? 0) * item.quantity;
            }
            let couponDiscount = 0;
            if (couponId) {
                const coupon = await tx.coupon.findUnique({
                    where: { id: couponId },
                });
                if (!coupon)
                    throw new common_1.NotFoundException('Coupon not found.');
                const now = new Date();
                if (coupon.expiresAt && coupon.expiresAt < now) {
                    throw new common_1.ForbiddenException('Coupon is expired.');
                }
                if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
                    throw new common_1.ForbiddenException('Coupon usage limit exceeded.');
                }
                if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
                    throw new common_1.ForbiddenException(`Order must be at least ${coupon.minOrderValue.toLocaleString('vi-VN')} to use this coupon.`);
                }
                couponDiscount = coupon.discount ?? 0;
            }
            const finalAmount = totalAmount - productDiscountAmount - couponDiscount + 0;
            if (finalAmount < 0) {
                throw new common_1.BadRequestException('Final order amount cannot be negative.');
            }
            const createdOrder = await tx.order.create({
                data: {
                    userId,
                    status: finalStatus,
                    paymentMethod: finalPaymentMethod,
                    note,
                    shippingAddressId,
                    couponId,
                    shippingFee: shippingFee,
                    totalAmount: totalAmount,
                    discountAmount: productDiscountAmount + couponDiscount,
                    finalAmount: finalAmount,
                    items: {
                        create: enrichedItems.map((item) => ({
                            productId: item.productId,
                            variantId: item.variantId,
                            sizeId: item.sizeId,
                            colorId: item.colorId,
                            quantity: item.quantity,
                            price: item.price,
                            discount: item.discount,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                            variant: true,
                            size: true,
                            color: true,
                        },
                    },
                    shippingAddress: true,
                    coupon: true,
                },
            });
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usedCount: { increment: 1 } },
                });
            }
            return createdOrder;
        });
        return {
            success: true,
            message: 'Order created successfully!',
            data: order,
        };
    }
    async findAll(userId, page = 1, limit = 10, search = '', statusFilter, paymentMethodFilter) {
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(search
                ? {
                    OR: [
                        { status: { contains: search, mode: 'insensitive' } },
                        { paymentMethod: { contains: search, mode: 'insensitive' } },
                    ],
                }
                : {}),
            ...(statusFilter ? { status: statusFilter } : {}),
            ...(paymentMethodFilter ? { paymentMethod: paymentMethodFilter } : {}),
        };
        const [orders, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                    thumb: true,
                                    color: {
                                        select: {
                                            id: true,
                                            title: true,
                                            code: true,
                                        },
                                    },
                                },
                            },
                            variant: {
                                select: {
                                    id: true,
                                    title: true,
                                    thumb: true,
                                },
                            },
                            size: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    coupon: {
                        select: {
                            id: true,
                            code: true,
                            discount: true,
                            expiresAt: true,
                            usageLimit: true,
                            usedCount: true,
                        },
                    },
                    shippingAddress: {
                        select: {
                            id: true,
                            userId: true,
                            fullName: true,
                            phone: true,
                            address: true,
                            ward: true,
                            district: true,
                            province: true,
                        },
                    },
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        const formattedOrders = orders.map((order) => ({
            id: order.id,
            userId: order.userId,
            shippingAddressId: order.shippingAddressId,
            couponId: order.couponId,
            status: order.status,
            paymentMethod: order.paymentMethod,
            note: order.note,
            totalAmount: order.totalAmount,
            discountAmount: order.discountAmount,
            finalAmount: order.finalAmount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map((item) => ({
                id: item.id,
                variantId: item.variantId,
                sizeId: item.sizeId,
                colorId: item.colorId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount,
                product: item.product
                    ? {
                        id: item.product.id,
                        title: item.product.title,
                        slug: item.product.slug,
                        thumb: item.product.thumb,
                        color: item.product.color
                            ? {
                                id: item.product.color.id,
                                title: item.product.color.title,
                                code: item.product.color.code,
                            }
                            : null,
                    }
                    : null,
                variant: item.variant ?? null,
                size: item.size ?? null,
            })),
            shippingAddress: order.shippingAddress,
            user: order.user,
            shippingFee: order.shippingFee,
        }));
        return {
            success: true,
            message: total > 0 ? 'Orders fetched successfully' : 'No orders found',
            data: formattedOrders,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findOrdersByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {
            userId,
        };
        const [orders, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    title: true,
                                    slug: true,
                                    thumb: true,
                                    color: {
                                        select: {
                                            id: true,
                                            title: true,
                                            code: true,
                                        },
                                    },
                                },
                            },
                            variant: {
                                select: {
                                    id: true,
                                    title: true,
                                    thumb: true,
                                },
                            },
                            size: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    coupon: {
                        select: {
                            id: true,
                            code: true,
                            discount: true,
                            expiresAt: true,
                            usageLimit: true,
                            usedCount: true,
                        },
                    },
                    shippingAddress: {
                        select: {
                            id: true,
                            userId: true,
                            fullName: true,
                            phone: true,
                            address: true,
                            ward: true,
                            district: true,
                            province: true,
                        },
                    },
                    user: {
                        select: {
                            email: true,
                        },
                    },
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        const formattedOrders = orders.map((order) => ({
            id: order.id,
            userId: order.userId,
            shippingAddressId: order.shippingAddressId,
            couponId: order.couponId,
            status: order.status,
            paymentMethod: order.paymentMethod,
            note: order.note,
            totalAmount: order.totalAmount,
            discountAmount: order.discountAmount,
            finalAmount: order.finalAmount,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: order.items.map((item) => ({
                id: item.id,
                variantId: item.variantId,
                sizeId: item.sizeId,
                colorId: item.colorId,
                quantity: item.quantity,
                price: item.price,
                discount: item.discount,
                product: item.product
                    ? {
                        id: item.product.id,
                        title: item.product.title,
                        slug: item.product.slug,
                        thumb: item.product.thumb,
                        color: item.product.color
                            ? {
                                id: item.product.color.id,
                                title: item.product.color.title,
                                code: item.product.color.code,
                            }
                            : null,
                    }
                    : null,
                variant: item.variant ?? null,
                size: item.size ?? null,
            })),
            shippingAddress: order.shippingAddress,
            user: order.user,
            coupon: order.coupon,
            shippingFee: order.shippingFee,
        }));
        return {
            success: true,
            message: total > 0 ? 'Orders fetched successfully' : 'No orders found for this user',
            data: formattedOrders,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                thumb: true,
                                color: {
                                    select: {
                                        id: true,
                                        title: true,
                                        code: true,
                                    },
                                },
                            },
                        },
                        variant: {
                            select: {
                                id: true,
                                title: true,
                                thumb: true,
                                color: {
                                    select: {
                                        id: true,
                                        title: true,
                                        code: true,
                                    },
                                },
                            },
                        },
                        size: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                coupon: {
                    select: {
                        id: true,
                        code: true,
                        discount: true,
                        expiresAt: true,
                        usageLimit: true,
                        usedCount: true,
                    },
                },
                shippingAddress: {
                    select: {
                        id: true,
                        userId: true,
                        fullName: true,
                        phone: true,
                        address: true,
                        ward: true,
                        district: true,
                        province: true,
                    },
                },
                user: {
                    select: {
                        email: true,
                    },
                },
            },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return {
            success: true,
            message: 'Order fetched successfully',
            data: order,
        };
    }
    async update(id, dto) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const allowedFields = ['status', 'note', 'paymentMethod', 'shippingAddressId'];
        const updateData = {};
        for (const key of allowedFields) {
            if (dto[key] !== undefined) {
                updateData[key] = dto[key];
            }
        }
        if (updateData.shippingAddressId) {
            updateData.shippingAddress = {
                connect: { id: updateData.shippingAddressId },
            };
            delete updateData.shippingAddressId;
        }
        const updated = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                items: {
                    include: {
                        product: true,
                        variant: true,
                        size: true,
                    },
                },
                shippingAddress: true,
            },
        });
        return {
            success: true,
            message: 'Order updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
        await this.prisma.order.delete({ where: { id } });
        return {
            success: true,
            message: 'Order deleted successfully',
        };
    }
    async cancelOrder(orderId, userId, dto) {
        const order = await this.prisma.order.findUnique({
            where: { id: +orderId },
        });
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        if (order.userId !== +userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền hủy đơn hàng này');
        }
        if (order.status !== 'pending') {
            throw new common_1.BadRequestException('Không thể hủy đơn hàng đã được xử lý');
        }
        const updatedOrder = await this.prisma.order.update({
            where: { id: +orderId },
            data: {
                status: 'cancelled',
                cancelReason: dto.reason,
            },
        });
        return {
            success: true,
            message: 'Hủy đơn hàng thành công',
            data: updatedOrder,
        };
    }
    async incrementCouponUsage(couponId, tx) {
        await tx.coupon.update({
            where: { id: couponId },
            data: {
                usedCount: {
                    increment: 1,
                },
            },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, ghtk_service_1.GhtkService])
], OrderService);
//# sourceMappingURL=order.service.js.map