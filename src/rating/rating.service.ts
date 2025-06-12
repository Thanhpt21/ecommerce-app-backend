import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  private async updateProductRatingCount(productId: number) {
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


  async create(dto: CreateRatingDto, userId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) throw new NotFoundException('Product not found');

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

  async update(ratingId: number, dto: UpdateRatingDto, userId: number) {
    const rating = await this.prisma.rating.findUnique({
        where: { id: ratingId },
    });

    if (!rating) throw new NotFoundException('Rating not found');
    if (rating.postedById !== userId) throw new UnauthorizedException('You can only update your own rating');

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

  async findAll(params: {
    productId?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { productId, search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.RatingWhereInput = {
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

  async findOne(id: number) {
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

async remove(id: number, userId: number) {
  const rating = await this.prisma.rating.findUnique({ where: { id } });
  if (!rating) throw new NotFoundException('Rating not found');
  await this.prisma.rating.delete({ where: { id } });
  await this.updateProductRatingCount(rating.productId);
  return { success: true, message: 'Rating deleted successfully' };
}
}
