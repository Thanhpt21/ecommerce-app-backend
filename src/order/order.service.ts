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
        shippingFee // Now, we only care about shippingFee from DTO
      } = dto;

      // Ensure initial status is valid
      const finalStatus = status || OrderStatus.PENDING;
      // Ensure paymentMethod is valid
      const finalPaymentMethod = paymentMethod || PaymentMethod.COD;

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

      // 4. Calculate shipping fee
      // let calculatedShippingFee = 0;

      // // Prefer using shippingFee if provided from the frontend
      // if (shippingFee !== undefined && shippingFee !== null) {
      //   calculatedShippingFee = shippingFee;
      // } else {
      //   // If shippingFee is not provided by the frontend,
      //   // it MUST be calculated here (e.g., by calling GHTK API).

      //   // Get recipient address details for GHTK
      //   const recipientAddress = await tx.shippingAddress.findUnique({
      //     where: { id: shippingAddressId },
      //     select: {
      //       address: true,
      //       wardName: true,
      //       districtName: true,
      //       provinceName: true,
      //       phone: true,
      //       fullName: true,
      //     },
      //   });

      //   if (!recipientAddress) {
      //     throw new NotFoundException('Shipping address for calculation not found.');
      //   }

      //   // ⭐ Define your store's pickup address here ⭐
      //   // This should ideally come from configuration (e.g., config service, .env)
      //   // For demonstration, using hardcoded values.
      //   const storePickupAddress = {
      //     pick_province: 'TP Hồ Chí Minh',
      //     pick_district: 'Quận 1',
      //     pick_ward: 'Phường Bến Nghé',
      //     pick_address: '123 Đường ABC, Phường Bến Nghé, Quận 1',
      //   };

      //   // Calculate total weight and value from enrichedItems for GHTK
      //   // IMPORTANT: Adjust these calculations based on your product data and GHTK's requirements
      //   const totalOrderWeight = enrichedItems.reduce((sum, item) => sum + (item.quantity * (/* item.weight from product/variant */ 0.5)), 0); // Example: 0.5kg per item
      //   // Ensure weight is in grams if GHTK expects grams, or convert. Assuming kg for now.
      //   const ghtkWeight = totalOrderWeight > 0 ? totalOrderWeight : 0.1; // GHTK might require min weight, e.g., 100g = 0.1kg
      //   const ghtkValue = totalAmount - productDiscountAmount; // GHTK usually uses the value after product discounts

      //   // Call GHTK to calculate the actual shipping fee
      //   try {
      //     const ghtkFeeResponse = await this.ghtkService.calculateShippingFee({
      //       pick_province: storePickupAddress.pick_province,
      //       pick_district: storePickupAddress.pick_district,
      //       pick_ward: storePickupAddress.pick_ward,
      //       pick_address: storePickupAddress.pick_address,
      //       province: recipientAddress.provinceName,
      //       district: recipientAddress.districtName,
      //       ward: recipientAddress.wardName,
      //       address: recipientAddress.address,
      //       weight: ghtkWeight,
      //       value: ghtkValue,
      //       transport: 'road', // Or 'fly' based on your preference/GHTK options
      //     });

      //     if (ghtkFeeResponse.success && ghtkFeeResponse.fee) {
      //       calculatedShippingFee = ghtkFeeResponse.fee.fee;
      //       // You can also store ghtkFeeResponse.fee.insurance_fee or extra_fee if needed
      //     } else {
      //       // Log the detailed GHTK error message if available
      //       this.logger.error(`GHTK Fee Calculation Error: ${ghtkFeeResponse.reason || ghtkFeeResponse.message || 'Unknown GHTK error'}`);
      //       throw new BadRequestException(
      //         ghtkFeeResponse.message || 'Failed to calculate shipping fee from GHTK. Please try again or contact support.'
      //       );
      //     }
      //   } catch (error) {
      //     this.logger.error(`Error during GHTK shipping fee calculation: ${error.message}`, error.stack);
      //     // Re-throw specific errors or a generic InternalServerErrorException
      //     if (error instanceof NotFoundException || error instanceof BadRequestException) {
      //       throw error;
      //     }
      //     throw new InternalServerErrorException('An error occurred while calculating external shipping fee.');
      //   }
      // }

      // 5. Calculate final order amount
      const finalAmount = totalAmount - productDiscountAmount - couponDiscount + 0;
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

  // Helper method to increment coupon usage count within a transaction
  private async incrementCouponUsage(
    couponId: number,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    await tx.coupon.update({
      where: { id: couponId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }
}
