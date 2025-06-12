import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShippingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateShippingDto) {
    const shipping = await this.prisma.shipping.create({
      data: {
        provinceName: dto.provinceName,
        fee: dto.fee,
      },
    });

    return {
      success: true,
      message: 'Shipping created successfully',
      data: shipping,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const whereClause = search
      ? { provinceName: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const [shippings, total] = await this.prisma.$transaction([
      this.prisma.shipping.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.shipping.count({ where: whereClause }),
    ]);

    return {
      success: true,
      message: total > 0 ? 'Shippings found successfully' : 'No shippings found',
      data: shippings,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findAllWithoutPagination(search = '') {
    const whereClause = search
      ? { provinceName: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const shippings = await this.prisma.shipping.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: shippings.length > 0 ? 'Shippings found successfully' : 'No shippings found',
      data: shippings,
    };
  }

  async findOne(id: number) {
    const shipping = await this.prisma.shipping.findUnique({ where: { id } });
    if (!shipping) throw new NotFoundException('Shipping not found');

    return {
      success: true,
      message: 'Shipping found successfully',
      data: shipping,
    };
  }

  async update(id: number, dto: UpdateShippingDto) {
    const shipping = await this.prisma.shipping.findUnique({ where: { id } });
    if (!shipping) throw new NotFoundException('Shipping not found');

    const updated = await this.prisma.shipping.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      message: 'Shipping updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const shipping = await this.prisma.shipping.findUnique({ where: { id } });
    if (!shipping) throw new NotFoundException('Shipping not found');

    await this.prisma.shipping.delete({ where: { id } });

    return {
      success: true,
      message: 'Shipping removed successfully',
    };
  }
}
