import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class SizeService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSizeDto) {
    const size = await this.prisma.size.create({
      data: {
        title: dto.title,
      },
    });

    return {
      success: true,
      message: 'Size created successfully',
      data: size,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const whereClause = search
      ? { title: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const [sizes, total] = await this.prisma.$transaction([
      this.prisma.size.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.size.count({ where : whereClause }),
    ]);

    return {
      success: true,
      message: total > 0 ? 'Sizes found successfully' : 'No sizes found',
      data: sizes,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findAllWithoutPagination(search = '') {
    const whereClause: Prisma.SizeWhereInput = search
      ? { title: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const sizes = await this.prisma.size.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: sizes.length > 0 ? 'Sizes found successfully' : 'No sizes found',
      data: sizes,
      total: sizes.length,
    };
  }

  async findOne(id: number) {
    const size = await this.prisma.size.findUnique({ where: { id } });
    if (!size) throw new NotFoundException('Size not found');

    return {
      success: true,
      message: 'Size found successfully',
      data: size,
    };
  }

  async update(id: number, dto: UpdateSizeDto) {
    const size = await this.prisma.size.findUnique({ where: { id } });
    if (!size) throw new NotFoundException('Size not found');

    const updated = await this.prisma.size.update({
      where: { id },
      data: dto,
    });

    return {
      success: true,
      message: 'Size updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const size = await this.prisma.size.findUnique({ where: { id } });
    if (!size) throw new NotFoundException('Size not found');

    await this.prisma.size.delete({ where: { id } });

    return {
      success: true,
      message: 'Size removed successfully',
    };
  }
}
