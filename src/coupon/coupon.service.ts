import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCouponDto) {
    const coupon = await this.prisma.coupon.create({
      data: {
        ...dto,
        usedCount: 0,
      },
    });

    return {
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const whereClause: Prisma.CouponWhereInput = search
        ? {
            OR: [
                { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
                { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
        }
        : {};

    const [coupons, total] = await this.prisma.$transaction([
        this.prisma.coupon.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        }),
        this.prisma.coupon.count({ where: whereClause }),
    ]);

    return {
        success: true,
        message: 'Coupons retrieved',
        data: coupons,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return {
      success: true,
      message: 'Coupon retrieved',
      data: coupon,
    };
  }

  async update(id: number, dto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    const updated = await this.prisma.coupon.update({ where: { id }, data: dto });

    return {
      success: true,
      message: 'Coupon updated',
      data: updated,
    };
  }

  async remove(id: number) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');

    await this.prisma.coupon.delete({ where: { id } });

    return {
      success: true,
      message: 'Coupon deleted',
    };
  }

  async useCoupon(code: string, orderValue: number) {
    // Tìm coupon theo code
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) {
      return {
        success: false,
        message: 'Coupon code không tồn tại',
      };
    }

    // Kiểm tra đã hết hạn chưa
    if (new Date(coupon.expiresAt) < new Date()) {
      return {
        success: false,
        message: 'Coupon đã hết hạn',
      };
    }

    // Kiểm tra còn lượt sử dụng không
    if (coupon.usedCount >= coupon.usageLimit) {
      return {
        success: false,
        message: 'Coupon đã hết lượt sử dụng',
      };
    }

    // Kiểm tra giá trị đơn hàng có đạt minOrderValue chưa
    if (orderValue < coupon.minOrderValue) {
      return {
        success: false,
        message: `Giá trị đơn hàng phải trên ${coupon.minOrderValue} để dùng coupon này`,
      };
    }


    return {
      success: true,
      message: 'Coupon đã được áp dụng',
      discountAmount: coupon.discount,
      couponId: coupon.id,
    };
  }

  async incrementCouponUsage(couponId: number) {
    try {
      const updatedCoupon = await this.prisma.coupon.update({
        where: { id: couponId },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
      console.log(`Coupon ID ${couponId} usage incremented. New count: ${updatedCoupon.usedCount}`);
      return true;
    } catch (error) {
      console.error(`Failed to increment usage for coupon ID ${couponId}:`, error);
      return false; // Or throw an error for more specific handling
    }
  }

}
