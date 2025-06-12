import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CancelOrderDto } from './dto/cancel-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, userId: number) {
    // Gói toàn bộ logic tạo đơn hàng trong một Prisma Transaction
    const order = await this.prisma.$transaction(async (tx) => { // Sử dụng 'tx' (transaction client)
      const {
        items,
        status,
        paymentMethod,
        shippingAddressId,
        note,
        couponId,
        shippingId,
        shippingFee
      } = dto;

      // 1. Tính toán từng item: lấy giá & giảm giá hiện tại
      const enrichedItems = await Promise.all(
        items.map(async (item: OrderItemDto) => {
          if (item.variantId) {
            const variant = await tx.variant.findUnique({ // <-- Sử dụng tx
              where: { id: item.variantId },
              select: { price: true, discount: true },
            });
            if (!variant) throw new NotFoundException('Variant not found');
            return {
              ...item,
              price: variant.price,
              discount: variant.discount,
            };
          } else if (item.productId) {
            const product = await tx.product.findUnique({ // <-- Sử dụng tx
              where: { id: item.productId },
              select: { price: true, discount: true },
            });
            if (!product) throw new NotFoundException('Product not found');
            return {
              ...item,
              price: product.price,
              discount: product.discount,
            };
          } else {
            throw new NotFoundException('Item must have either productId or variantId');
          }
        }),
      );

      // 2. Tính toán tổng tiền sản phẩm (trước phí ship và coupon)
      let totalAmount = 0;
      let productDiscountAmount = 0;
      for (const item of enrichedItems) {
        totalAmount += item.price * item.quantity;
        productDiscountAmount += (item.discount ?? 0) * item.quantity;
      }

      // 3. Áp dụng coupon nếu có (Chỉ kiểm tra và tính toán giảm giá, KHÔNG TĂNG usedCount ở đây)
      let couponDiscount = 0;
      if (couponId) {
        const coupon = await tx.coupon.findUnique({ // <-- Sử dụng tx
          where: { id: couponId },
        });

        if (!coupon) throw new NotFoundException('Coupon not found');

        const now = new Date();

        // Kiểm tra hết hạn
        if (coupon.expiresAt && coupon.expiresAt < now) {
          throw new ForbiddenException('Coupon is expired');
        }

        // Kiểm tra số lần sử dụng
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
          throw new ForbiddenException('Coupon usage limit exceeded');
        }

        // Kiểm tra giá trị đơn tối thiểu
        if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
          throw new ForbiddenException(
            `Order must be at least ${coupon.minOrderValue.toLocaleString('vi-VN')} to use this coupon`,
          );
        }

        // Áp dụng giảm giá
        couponDiscount = coupon.discount ?? 0;

        // *** LOẠI BỎ DÒNG CẬP NHẬT COUPON TRỰC TIẾP Ở ĐÂY NỮA ***
        // await this.prisma.coupon.update({ ... });
      }

      // 4. Tính toán phí vận chuyển
      let calculatedShippingFee = 0;
      let finalShippingId: number | null = null; // Biến này sẽ lưu ID nếu có, hoặc null

      // Ưu tiên sử dụng shippingFee nếu nó được cung cấp từ frontend
      if (shippingFee !== undefined && shippingFee !== null) {
        calculatedShippingFee = shippingFee;
        // Ở đây, nếu bạn gửi shippingFee, theo logic mới từ frontend, shippingId sẽ là undefined.
        // Tuy nhiên, nếu frontend vẫn gửi shippingId (do một lý do nào đó), bạn có thể chọn bỏ qua nó
        // hoặc vẫn lưu lại nếu muốn cho mục đích ghi nhận.
        // Để nhất quán với "nếu có phí thì không gửi ID", chúng ta có thể bỏ qua shippingId ở đây
        finalShippingId = null; // Đảm bảo không lưu shippingId nếu phí được gửi
        
      } else if (shippingId !== undefined && shippingId !== null) {
        // Nếu shippingFee không được cung cấp, tra cứu từ shippingId
        const shippingInfo = await tx.shipping.findUnique({
          where: { id: shippingId },
        });
        // Xử lý trường hợp ID 0 (Giao hàng tiêu chuẩn) nếu nó không có trong DB
        // NHƯNG NHẤT QUÁN HƠN LÀ NÊN CÓ RECORD ID 0 TRONG DB
        if (shippingInfo) {
          calculatedShippingFee = shippingInfo.fee;
          finalShippingId = shippingInfo.id;
        } else {
          throw new BadRequestException(`Shipping method with ID ${shippingId} not found.`);
        }
      } else {
        // Cả shippingId và shippingFee đều không có (hoặc null)
        throw new BadRequestException('Shipping fee is required if no shipping method is selected.');
      }

      // 5. Tính toán tổng số tiền cuối cùng của đơn hàng
      const finalAmount = totalAmount - productDiscountAmount - couponDiscount + calculatedShippingFee;
      if (finalAmount < 0) {
        throw new BadRequestException('Final amount cannot be negative');
      }


      // 6. Tạo đơn hàng trong database
      const createdOrder = await tx.order.create({ // <-- Sử dụng tx
        data: {
          userId,
          status,
          paymentMethod,
          note,
          shippingAddressId,
          couponId,
          shippingId,
          shippingFee: calculatedShippingFee,
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
          shipping: true,
        },
      } satisfies Prisma.OrderCreateArgs);

      // 7. Tăng lượt sử dụng coupon SAU KHI ĐƠN HÀNG ĐƯỢC TẠO THÀNH CÔNG
      //    VÀ TRONG CÙNG MỘT TRANSACTION
      if (couponId) {
        await this.incrementCouponUsage(couponId, tx); // <-- Gọi hàm ở đây, truyền tx vào
      }

      return createdOrder; // Trả về đơn hàng đã tạo
    });

    return {
      success: true,
      message: 'Order created successfully',
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
        shipping: true,
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
     shipping: order.shipping,
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
          shipping: true,
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
      shipping: order.shipping,
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
        shipping: true,
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
