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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CouponService = class CouponService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
        const whereClause = search
            ? {
                OR: [
                    { title: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    { code: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
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
    async findOne(id) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return {
            success: true,
            message: 'Coupon retrieved',
            data: coupon,
        };
    }
    async update(id, dto) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const updated = await this.prisma.coupon.update({ where: { id }, data: dto });
        return {
            success: true,
            message: 'Coupon updated',
            data: updated,
        };
    }
    async remove(id) {
        const coupon = await this.prisma.coupon.findUnique({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        await this.prisma.coupon.delete({ where: { id } });
        return {
            success: true,
            message: 'Coupon deleted',
        };
    }
    async useCoupon(code, orderValue) {
        const coupon = await this.prisma.coupon.findUnique({ where: { code } });
        if (!coupon) {
            return {
                success: false,
                message: 'Coupon code không tồn tại',
            };
        }
        if (new Date(coupon.expiresAt) < new Date()) {
            return {
                success: false,
                message: 'Coupon đã hết hạn',
            };
        }
        if (coupon.usedCount >= coupon.usageLimit) {
            return {
                success: false,
                message: 'Coupon đã hết lượt sử dụng',
            };
        }
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
    async incrementCouponUsage(couponId) {
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
        }
        catch (error) {
            console.error(`Failed to increment usage for coupon ID ${couponId}:`, error);
            return false;
        }
    }
};
exports.CouponService = CouponService;
exports.CouponService = CouponService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouponService);
//# sourceMappingURL=coupon.service.js.map