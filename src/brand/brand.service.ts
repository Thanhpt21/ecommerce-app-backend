import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { extractPublicId } from 'src/utils/file.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class BrandService {
  constructor(private prisma: PrismaService, private uploadService: UploadService) {}

  async create(dto: CreateBrandDto, file?: Express.Multer.File) {
    let image = dto.image;

    if (file) {
      const { secure_url } = await this.uploadService.uploadImage(file, 0, 'brand');
      image = secure_url;
    }

    const newBrand = await this.prisma.brand.create({ data: { ...dto, image } });

    return {
      success: true,
      message: 'Brand created successfully',
      data: newBrand,
    };
  }

  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const whereClause: Prisma.BrandWhereInput = search
      ? { title: { contains: search, mode: 'insensitive' } }
      : {};

    const [brands, total] = await this.prisma.$transaction([
      this.prisma.brand.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.brand.count({ where: whereClause }),
    ]);

    return {
      success: true,
      message: total > 0 ? 'Brands found successfully' : 'No brands found',
      data: brands,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

   async findAllWithoutPagination(search = '') {
    const whereClause: Prisma.BrandWhereInput = search
      ? { title: { contains: search, mode: 'insensitive' } }
      : {};

    const brands = await this.prisma.brand.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message:
        brands.length > 0 ? 'Brands found successfully' : 'No brands found',
      data: brands,
      total: brands.length,
    };
  }

  async findOne(id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');

    return {
      success: true,
      message: 'Brand found successfully',
      data: brand,
    };
  }

  async update(id: number, dto: UpdateBrandDto, file?: Express.Multer.File) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');

    const updateData: any = { ...dto };

    if (file) {
      const currentPublicId = extractPublicId(brand.image);
      if (currentPublicId) {
        await this.uploadService.deleteImage(currentPublicId);
      }

      const { secure_url } = await this.uploadService.uploadImage(file, id, 'brand');
      updateData.image = secure_url;
    }

    const updatedBrand = await this.prisma.brand.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Brand updated successfully',
      data: updatedBrand,
    };
  }

  async remove(id: number) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');

    const publicId = extractPublicId(brand.image);
    if (publicId) {
      await this.uploadService.deleteImage(publicId);
    }

    await this.prisma.brand.delete({ where: { id } });

    return {
      success: true,
      message: 'Brand removed successfully',
    };
  }
}
