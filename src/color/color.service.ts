import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ColorService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateColorDto) {
    const color = await this.prisma.color.create({
      data: {
        title: dto.title,
        code: dto.code,
      },
    });

    return {
      success: true,
      message: 'Color created successfully',
      data: color,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const whereClause = search
      ? { title: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const [colors, total] = await this.prisma.$transaction([
      this.prisma.color.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.color.count({ where: whereClause }),
    ]);

    return {
      success: true,
      message: total > 0 ? 'Colors found successfully' : 'No colors found',
      data: colors,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findAllWithoutPagination(search = '') {
    const whereClause = search
      ? { title: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const colors = await this.prisma.color.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: colors.length > 0 ? 'Colors found successfully' : 'No colors found',
      data: colors,
      total: colors.length,
    };
  }

  async findOne(id: number) {
    const color = await this.prisma.color.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Color not found');

    return {
      success: true,
      message: 'Color found successfully',
      data: color,
    };
  }

  async update(id: number, dto: UpdateColorDto) {
    const color = await this.prisma.color.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Color not found');

    const updated = await this.prisma.color.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      message: 'Color updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const color = await this.prisma.color.findUnique({ where: { id } });
    if (!color) throw new NotFoundException('Color not found');

    await this.prisma.color.delete({ where: { id } });

    return {
      success: true,
      message: 'Color removed successfully',
    };
  }
}
