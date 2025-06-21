import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { GhtkService } from 'src/ghtk/ghtk.service';
import { OrderStatus, PaymentMethod } from './enums/order.enums';
import * as crypto from 'crypto';
import { generateSecureRandomCode } from 'src/utils/file.util';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name)
  constructor(private readonly prisma: PrismaService,  private ghtkService: GhtkService ) {}


async create(dto: CreateOrderDto, userId: number) {
    const order = await this.prisma.$transaction(async (tx) => {
      const {
        items,
        status, // Should be 'pending' from frontend or handled as default
        paymentMethod,
        shippingAddressId,
        note,
        couponId,
        shippingFee,
      } = dto;

      // Ensure initial status is valid
      const finalStatus = status || OrderStatus.Pending;
      // Ensure paymentMethod is valid
      const finalPaymentMethod = paymentMethod || PaymentMethod.COD;

      let orderCode: string = generateSecureRandomCode(10);
      let isUnique = false;
      while (!isUnique) {
          const existingOrder = await tx.order.findUnique({
              where: { orderCode: orderCode },
          });

          if (!existingOrder) {
              isUnique = true; 
          } else {
              orderCode = generateSecureRandomCode(10);
          }
      }

      // 1. Calculate each item: get current price & discount
      const enrichedItems = await Promise.all(
        items.map(async (item: OrderItemDto) => {
          let productData;
          if (item.variantId) {
            const variant = await tx.variant.findUnique({
              where: { id: item.variantId },
              select: { price: true, discount: true, productId: true },
            });
            if (!variant) throw new NotFoundException(`Variant with ID ${item.variantId} not found.`);
            // Optionally, fetch product details if variant doesn't have enough info
            productData = { price: variant.price, discount: variant.discount };
          } else if (item.productId) {
            const product = await tx.product.findUnique({
              where: { id: item.productId },
              select: { price: true, discount: true },
            });
            if (!product) throw new NotFoundException(`Product with ID ${item.productId} not found.`);
            productData = { price: product.price, discount: product.discount };
          } else {
            throw new BadRequestException('Order item must have either productId or variantId.');
          }

          return {
            ...item,
            price: productData.price,
            discount: productData.discount,
          };
        }),
      );

      // 2. Calculate total product amount (before shipping fee and coupon)
      let totalAmount = 0;
      let productDiscountAmount = 0;
      for (const item of enrichedItems) {
        totalAmount += item.price * item.quantity;
        productDiscountAmount += (item.discount ?? 0) * item.quantity;
      }

      // 3. Apply coupon if available (Only validate and calculate discount, DO NOT increment usedCount yet)
      let couponDiscount = 0;
      if (couponId) {
        const coupon = await tx.coupon.findUnique({
          where: { id: couponId },
        });

        if (!coupon) throw new NotFoundException('Coupon not found.');

        const now = new Date();

        if (coupon.expiresAt && coupon.expiresAt < now) {
          throw new ForbiddenException('Coupon is expired.');
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
          throw new ForbiddenException('Coupon usage limit exceeded.');
        }

        if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
          throw new ForbiddenException(
            `Order must be at least ${coupon.minOrderValue.toLocaleString('vi-VN')} to use this coupon.`,
          );
        }

        couponDiscount = coupon.discount ?? 0;
        // No coupon usage increment here. It's done at the end of the transaction.
      }

      // 5. Calculate final order amount
      const finalAmount = totalAmount - productDiscountAmount - couponDiscount + (shippingFee ?? 0);
      if (finalAmount < 0) {
        throw new BadRequestException('Final order amount cannot be negative.');
      }

      // 6. Create the order in the database
      const createdOrder = await tx.order.create({
        data: {
          userId,
          status: finalStatus,
          paymentMethod: finalPaymentMethod,
          note,
          shippingAddressId,
          couponId,
          // Removed shippingId field as per your request
          shippingFee: shippingFee, // Save the calculated shipping fee
          totalAmount: totalAmount,
          discountAmount: productDiscountAmount + couponDiscount,
          finalAmount: finalAmount,
          orderCode: orderCode,
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
          // Removed shipping relation include
        },
      } satisfies Prisma.OrderCreateArgs);

      // 7. Increment coupon usage AFTER the order is successfully created
      //    AND within the same transaction
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return createdOrder; // Return the created order
    });

    return {
      success: true,
      message: 'Order created successfully!',
      data: order,
    };
  }



async findAll( userId: any, page = 1, limit = 10, search = '',  statusFilter?: string,
  paymentMethodFilter?: string) {
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    userId,
    ...(search
      ? {
          OR: [
            { status: { contains: search, mode: 'insensitive' } },
            { paymentMethod: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(statusFilter ? { status: statusFilter } : {}), // Áp dụng lọc trạng thái
    ...(paymentMethodFilter ? { paymentMethod: paymentMethodFilter } : {}), // Áp dụng lọc phương thức thanh toán
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
        user: { // Include thông tin user
          select: {
            email: true, // Chọn trường email
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

async findOrdersByUser(userId: number, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
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
          user: { // Include thông tin user
            select: {
              email: true, // Chọn trường email
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
      orderCode: order.orderCode,
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



  async findOne(id: number) {
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
        user: { // Include thông tin user
          select: {
            email: true, // Chọn trường email
          },
        },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    return {
      success: true,
      message: 'Order fetched successfully',
      data: order,
    };
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const allowedFields = ['status', 'note', 'paymentMethod', 'shippingAddressId'];
    const updateData: any = {};

    for (const key of allowedFields) {
      if (dto[key] !== undefined) {
        updateData[key] = dto[key];
      }
    }

    // Nếu có shippingAddressId thì connect thay vì gán trực tiếp
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



  async remove(id: number) {
      const order = await this.prisma.order.findUnique({ where: { id } });
      if (!order) throw new NotFoundException('Order not found');

      await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
      await this.prisma.order.delete({ where: { id } });

      return {
        success: true,
        message: 'Order deleted successfully',
      };
    }

  async cancelOrder(orderId: string, userId: string, dto: CancelOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: +orderId },
    });

    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }

    // Kiểm tra quyền hủy (tùy logic, VD chỉ cho phép chủ đơn hủy khi đơn chưa giao)
    if (order.userId !== +userId) {
      throw new ForbiddenException('Bạn không có quyền hủy đơn hàng này');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Không thể hủy đơn hàng đã được xử lý');
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

}
