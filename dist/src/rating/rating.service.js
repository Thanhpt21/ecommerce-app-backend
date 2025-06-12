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
exports.RatingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RatingService = class RatingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateProductRatingCount(productId) {
        const { _avg, _count } = await this.prisma.rating.aggregate({
            where: { productId },
            _avg: { star: true },
            _count: { star: true },
        });
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                averageRating: Number((_avg.star ?? 0).toFixed(1)),
                ratingCount: _count.star,
            },
        });
    }
    async create(dto, userId) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const rating = await this.prisma.rating.create({
            data: {
                star: dto.star,
                comment: dto.comment,
                postedById: userId,
                productId: dto.productId,
            },
        });
        await this.updateProductRatingCount(dto.productId);
        return {
            success: true,
            message: 'Rating submitted successfully',
            data: rating,
        };
    }
    async update(ratingId, dto, userId) {
        const rating = await this.prisma.rating.findUnique({
            where: { id: ratingId },
        });
        if (!rating)
            throw new common_1.NotFoundException('Rating not found');
        if (rating.postedById !== userId)
            throw new common_1.UnauthorizedException('You can only update your own rating');
        const updated = await this.prisma.rating.update({
            where: { id: ratingId },
            data: { ...dto },
        });
        await this.updateProductRatingCount(rating.productId);
        return {
            success: true,
            message: 'Rating updated successfully',
            data: updated,
        };
    }
    async findAll(params) {
        const { productId, search, page = 1, limit = 10 } = params;
        const skip = (page - 1) * limit;
        const where = {
            ...(productId && { productId }),
            ...(search && {
                comment: {
                    contains: search,
                    mode: 'insensitive',
                },
            }),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.rating.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    postedBy: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profilePicture: true,
                        },
                    },
                },
            }),
            this.prisma.rating.count({ where }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Ratings found' : 'No ratings',
            data,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        return this.prisma.rating.findUnique({
            where: { id },
            include: {
                postedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profilePicture: true,
                    },
                },
            },
        });
    }
    async remove(id, userId) {
        const rating = await this.prisma.rating.findUnique({ where: { id } });
        if (!rating)
            throw new common_1.NotFoundException('Rating not found');
        await this.prisma.rating.delete({ where: { id } });
        await this.updateProductRatingCount(rating.productId);
        return { success: true, message: 'Rating deleted successfully' };
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingService);
//# sourceMappingURL=rating.service.js.map