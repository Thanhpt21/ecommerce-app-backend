import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { extractPublicId } from 'src/utils/file.util';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(dto: CreateStoreDto, file?: Express.Multer.File) {
    let image = dto.image;

    if (file) {
      const { secure_url } = await this.uploadService.uploadImage(file, 0, 'store');
      image = secure_url;
    }

    const store = await this.prisma.store.create({
      data: { ...dto, image: image },
    });

    return {
      success: true,
      message: 'Store created successfully',
      data: store,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const where: Prisma.StoreWhereInput =  search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [stores, total] = await this.prisma.$transaction([
      this.prisma.store.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      success: true,
      message: 'Store list retrieved successfully',
      data: stores,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    return {
      success: true,
      message: 'Store retrieved successfully',
      data: store,
    };
  }

  async update(id: number, dto: UpdateStoreDto, file?: Express.Multer.File) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    const updateData: any = { ...dto };

    if (file) {
      const oldPublicId = extractPublicId(store.image);
      if (oldPublicId) {
        await this.uploadService.deleteImage(oldPublicId);
      }

      const { secure_url } = await this.uploadService.uploadImage(file, id, 'store');
      updateData.image = secure_url;
    }

    const updated = await this.prisma.store.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Store updated successfully',
      data: updated,
    };
  }

  async remove(id: number) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    const publicId = extractPublicId(store.image);
    if (publicId) {
      await this.uploadService.deleteImage(publicId);
    }

    await this.prisma.store.delete({ where: { id } });

    return {
      success: true,
      message: 'Store removed successfully',
    };
  }
}
