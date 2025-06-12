import {
    BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { Prisma } from '@prisma/client';
import { extractPublicId } from 'src/utils/file.util';

@Injectable()
export class VariantService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}
  

  // Tạo variant
async create(
        dto: CreateVariantDto,
        files: { thumb?: Express.Multer.File[]; images?: Express.Multer.File[] },
    ) {
        let thumb = dto.thumb;
        let images: string[] = [];

        if (files?.thumb?.[0]) {
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], 0, 'variant');
            thumb = secure_url;
        }

        if (files?.images?.length) {
            const uploaded = await Promise.all(
                files.images.map((file) => this.uploadService.uploadImage(file, 0, 'variant')),
            );
            images = uploaded.map((img) => img.secure_url);
        }

        if (!thumb) {
            throw new BadRequestException('Thumb is required');
        }

        // Kiểm tra sizeIds hợp lệ (nếu có)
        let sizeIds: number[] = [];
        if (dto.sizeIds) {
            try {
                sizeIds = (typeof dto.sizeIds === 'string' ? JSON.parse(dto.sizeIds) : dto.sizeIds).map((id: any) => Number(id));
            } catch (error) {
                throw new BadRequestException('Invalid sizeIds format');
            }
        } else {
            sizeIds = [];
        }

        if (sizeIds.length > 0) {
            const validSizes = await this.prisma.size.findMany({
                where: { id: { in: sizeIds } },
            });
            if (validSizes.length !== sizeIds.length) {
                throw new BadRequestException('Some sizeIds are invalid');
            }
        }

        // Create Variant
        const variant = await this.prisma.variant.create({
            data: {
                title: dto.title,
                price: Number(dto.price),
                discount: dto.discount ? Number(dto.discount) : 0,
                productId: Number(dto.productId),
                colorId: dto.colorId ? Number(dto.colorId) : undefined,
                thumb,
                images,
                sku: `SKU-${dto.productId}-${Date.now()}`,
            },
        });

        // Thêm quan hệ size nếu có
        if (sizeIds.length > 0) {
            await this.prisma.variantSize.createMany({
                data: sizeIds.map((sizeId) => ({
                    variantId: variant.id,
                    sizeId,
                })),
                skipDuplicates: true,
            });
        }

        // Trả về kết quả kèm theo size nếu muốn
        const variantWithSizes = await this.prisma.variant.findUnique({
            where: { id: variant.id },
            include: {
                sizes: {
                    include: {
                        size: true,
                    },
                },
                color: true,
            },
        });

        return {
            success: true,
            message: 'Variant created successfully',
            data: variantWithSizes,
        };
    }


  // Cập nhật variant
  async update(
    id: number,
    dto: UpdateVariantDto,
    files: { thumb?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    const existingVariant = await this.prisma.variant.findUnique({
      where: { id },
      include: {
        sizes: true, // Để biết các liên kết size hiện có
      },
    });

    if (!existingVariant) {
      throw new NotFoundException('Variant not found');
    }

    const updateData: any = { ...dto };

    let thumbUrl = existingVariant.thumb;
    let newImagesUrls: string[] = [...existingVariant.images];

    // Upload thumb mới nếu có
    if (files?.thumb?.[0]) {
      const oldThumbPublicId = extractPublicId(existingVariant.thumb);
      if (oldThumbPublicId) {
        await this.uploadService.deleteImage(oldThumbPublicId);
      }
      const { secure_url } = await this.uploadService.uploadImage(
        files.thumb[0],
        id,
        'variant',
      );
      thumbUrl = secure_url;
      updateData.thumb = thumbUrl;
    }

    // Upload images mới nếu có
    if (files?.images?.length) {
      const oldImagePublicIds = existingVariant.images
        .map(extractPublicId)
        .filter((imageId): imageId is string => !!imageId);
      await Promise.all(
        oldImagePublicIds.map((oldId) => this.uploadService.deleteImage(oldId)),
      );

      const uploaded = await Promise.all(
        files.images.map((file) =>
          this.uploadService.uploadImage(file, id, 'variant'),
        ),
      );
      newImagesUrls = uploaded.map((img) => img.secure_url);
      updateData.images = newImagesUrls;
    } else if (files?.images && files.images.length === 0) {
      const oldImagePublicIds = existingVariant.images
        .map(extractPublicId)
        .filter((imageId): imageId is string => !!imageId);
      await Promise.all(
        oldImagePublicIds.map((oldId) => this.uploadService.deleteImage(oldId)),
      );
      newImagesUrls = [];
      updateData.images = newImagesUrls;
    }

    // Đảm bảo các field số nếu undefined thì không lỗi Prisma
    const numericFields = ['price', 'discount', 'colorId', 'productId'].reduce(
      (acc, field) => {
        if (dto[field] !== undefined && dto[field] !== null) {
          acc[field] = Number(dto[field]);
        }
        return acc;
      },
      {},
    );
    Object.assign(updateData, numericFields);

    delete updateData.sizeIds; // Xóa tạm thời để xử lý riêng
    // delete updateData.title; // ĐÃ BỎ DÒNG NÀY ĐỂ CHO PHÉP CẬP NHẬT TITLE
    delete updateData.sku; // Bỏ sku vì nó được tự động sinh ra và không nên cập nhật

    // Cập nhật bản ghi chính của variant (không bao gồm sizeIds)
    await this.prisma.variant.update({
      where: { id },
      data: updateData,
    });

    // Xử lý sizeIds
    let sizeIdsToProcess: number[] = [];
    if (dto.sizeIds !== undefined) {
      try {
        sizeIdsToProcess = Array.isArray(dto.sizeIds)
          ? dto.sizeIds.map(id => Number(id))
          : JSON.parse(dto.sizeIds as string).map((id: any) => Number(id));

        sizeIdsToProcess = sizeIdsToProcess
          .filter(id => !isNaN(id) && id > 0);

      } catch (error) {
        throw new BadRequestException('Invalid sizeIds format');
      }

      // Validate size tồn tại (tùy chọn, bạn có thể bỏ qua nếu đã validate ở frontend)
      if (sizeIdsToProcess.length > 0) {
        const validSizes = await this.prisma.size.findMany({
          where: { id: { in: sizeIdsToProcess } },
        });
        if (validSizes.length !== sizeIdsToProcess.length) {
          throw new BadRequestException('Some sizeIds are invalid');
        }
      }

      // Xoá toàn bộ size cũ của variant
      await this.prisma.variantSize.deleteMany({ where: { variantId: id } });

      // Gán lại size mới cho variant
      if (sizeIdsToProcess.length > 0) {
        await this.prisma.variantSize.createMany({
          data: sizeIdsToProcess.map((sizeId) => ({
            variantId: id,
            sizeId,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Lấy lại variant đã cập nhật cùng size và color
    const finalVariant = await this.prisma.variant.findUnique({
      where: { id },
      include: {
        sizes: { include: { size: true } },
        color: true,
      },
    });

    if (!finalVariant) {
      throw new InternalServerErrorException('Variant not found after update');
    }

    const formattedVariant = {
      ...finalVariant,
      sizes: finalVariant.sizes.map((item) => item.size),
    };
    delete (formattedVariant as any).sizes;

    return {
      success: true,
      message: 'Variant updated successfully',
      data: formattedVariant,
    };
  }

  async findAll(
    productId: number,
    page = 1,
    limit = 10,
    search = '',
  ) {
    const skip = (page - 1) * limit;

    if (!productId) {
      throw new BadRequestException('productId is required');
    }

    const whereClause: Prisma.VariantWhereInput = {
      productId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { sku: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [variants, total] = await this.prisma.$transaction([
      this.prisma.variant.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sizes: {
            select: {
              size: {
                select: {
                  id: true,
                  title: true,
                },
              }
            },
          },
           color: { // Thêm include cho color
              select: {
                  id: true,
                  title: true,
                  code: true,
              },
          },
        },
      }),
      this.prisma.variant.count({ where: whereClause }),
    ]);

    // Flatten sizes: sizes: [{ id, name, ... }]
    const variantsWithSizes = variants.map((variant) => ({
      ...variant,
      sizes: variant.sizes.map((vs) => vs.size),
      color: variant.color,
    }));

    return {
      success: true,
      data: variantsWithSizes,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }



  async findOne(id: number) {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      include: {
        sizes: {
          select: {
            size: {
              select: {
                id: true,
                title: true, // hoặc name nếu bạn dùng field name
              },
            },
          },
        },
      },
    });

    if (!variant) throw new NotFoundException('Variant not found');

    // Map lại để lấy sizes ra đúng dạng mảng
    const formatted = {
      ...variant,
      sizes: variant.sizes.map((vs) => vs.size),
    };

    return {
      success: true,
      data: [formatted],
      total: 1,
      page: 1,
      pageCount: 1,
    };
  }


  async remove(id: number) {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    // Xóa ảnh khỏi Cloudinary
    if (variant.thumb) {
      await this.uploadService.deleteImageFromUrl(variant.thumb);
    }

    if (variant.images.length) {
      for (const img of variant.images) {
        await this.uploadService.deleteImageFromUrl(img);
      }
    }

    // Xoá liên kết size
    await this.prisma.variantSize.deleteMany({
      where: { variantId: id },
    });

    // Xoá Variant
    await this.prisma.variant.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Variant deleted successfully',
    };
  }

  async getSizesByVariantId(variantId: number) {
    const variant = await this.prisma.variant.findUnique({
      where: { id: variantId },
      include: {
        sizes: {
          include: {
            size: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID ${variantId} not found`);
    }

    const sizes = variant.sizes.map((vs) => vs.size);

    return {
      success: true,
      message: `Sizes for variant ID ${variantId} fetched successfully`,
      data: sizes,
    };
  }

}
