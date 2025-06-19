import {
    BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateVariantDto, VariantSizeDto } from './dto/create-variant.dto';
import { UpdateVariantDto, VariantSizeUpdateItemDto } from './dto/update-variant.dto';
import { Prisma } from '@prisma/client';
import { extractPublicId } from 'src/utils/file.util';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { VariantSizeDetail } from 'src/types/variant.type';

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

        let parsedVariantSizes: VariantSizeDto[] = [];
        if (dto.variantSizes) { // Sử dụng tên trường DTO mới: variantSizes
            try {
                const rawVariantSizes = JSON.parse(dto.variantSizes);

                if (!Array.isArray(rawVariantSizes)) {
                    throw new BadRequestException('Dữ liệu variantSizes phải là một mảng.');
                }

                const validationErrors: ValidationError[] = [];
                for (const item of rawVariantSizes) {
                    const instance = plainToInstance(VariantSizeDto, item); // Sử dụng VariantSizeDto
                    const errors = await validate(instance);
                    if (errors.length > 0) {
                        validationErrors.push(...errors);
                    } else {
                        parsedVariantSizes.push(instance);
                    }
                }

                if (validationErrors.length > 0) {
                    // Cải thiện thông báo lỗi chi tiết
                    const errorMessages = validationErrors.map(err => {
                        return err.constraints ? Object.values(err.constraints).join(', ') : 'Lỗi không xác định.';
                    }).flat();
                    throw new BadRequestException(`Lỗi validation variantSizes: ${errorMessages.join('; ')}`);
                }

            } catch (parseError: any) {
                // Log lỗi parse để debug
                // console.error('Lỗi parse variantSizes:', parseError); // Kích hoạt khi debug
                throw new BadRequestException('Dữ liệu variantSizes không hợp lệ (không phải JSON hoặc sai cấu trúc).');
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
                sku: `SKU-${dto.productId}`,
            },
        });

        // ⭐ LOGIC MỚI: Tạo các bản ghi VariantSize với quantity ⭐
        if (parsedVariantSizes.length > 0) {
            await this.prisma.variantSize.createMany({
                data: parsedVariantSizes.map((vs) => ({
                    variantId: variant.id,
                    sizeId: vs.sizeId,
                    quantity: vs.quantity ?? 0, // Đặt mặc định là 0 nếu không được cung cấp
                })),
                skipDuplicates: true, // Hữu ích để tránh lỗi nếu có bản ghi trùng lặp
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
        // 1. Tìm biến thể và Xác thực ban đầu
        const existingVariant = await this.prisma.variant.findUnique({
            where: { id },
            include: {
                sizes: true, // Bao gồm các liên kết VariantSize hiện có để quản lý chúng
            },
        });

        if (!existingVariant) {
            throw new NotFoundException(`Không tìm thấy biến thể với ID ${id}.`);
        }

        // 2. Chuẩn bị dữ liệu cập nhật
        const updateData: Prisma.VariantUpdateInput = {};

        // Gán các trường trực tiếp từ DTO nếu chúng tồn tại
        // Các trường này đã được ValidationPipe và class-transformer xử lý (kiểu, chuyển đổi)
        if (dto.title !== undefined) updateData.title = dto.title;
        if (dto.price !== undefined) updateData.price = dto.price;
        if (dto.discount !== undefined) updateData.discount = dto.discount;

        // Xử lý ColorId
        if (dto.colorId !== undefined) {
            updateData.color = dto.colorId === null ? { disconnect: true } : { connect: { id: dto.colorId } };
        }

        // 3. Xử lý tải lên Thumb
        if (files?.thumb?.[0]) {
            // Xóa thumb cũ nếu có
            if (existingVariant.thumb) {
                const oldThumbPublicId = extractPublicId(existingVariant.thumb);
                if (oldThumbPublicId) {
                    await this.uploadService.deleteImage(oldThumbPublicId);
                }
            }
            // Tải lên thumb mới
            const { secure_url } = await this.uploadService.uploadImage(
                files.thumb[0],
                id,
                'variant', // Đảm bảo folder là 'variant'
            );
            updateData.thumb = secure_url;
        }

        // 4. Xử lý tải lên Images (Thay thế tất cả ảnh hiện có nếu ảnh mới được cung cấp)
        if (files?.images?.length) {
            // Xóa tất cả ảnh cũ
            if (existingVariant.images && existingVariant.images.length > 0) {
                const oldImagePublicIds = existingVariant.images
                    .map(extractPublicId)
                    .filter((_id): _id is string => !!_id);
                await Promise.all(
                    oldImagePublicIds.map((publicId) =>
                        this.uploadService.deleteImage(publicId),
                    ),
                );
            }
            // Tải lên ảnh mới
            const uploadedImages = await Promise.all(
                files.images.map((file) =>
                    this.uploadService.uploadImage(file, id, 'variant'), // Đảm bảo folder là 'variant'
                ),
            );
            updateData.images = uploadedImages.map((img) => img.secure_url);
        } else if (dto.images !== undefined) {
            // Nếu client gửi trường images trong DTO (có thể là mảng rỗng hoặc null)
            // Dto.images đã là string[] hoặc null nhờ class-transformer
            if (dto.images !== null && dto.images.length === 0) {
                // Nếu client muốn xóa tất cả ảnh hiện có (gửi mảng rỗng)
                if (existingVariant.images && existingVariant.images.length > 0) {
                    const oldImagePublicIds = existingVariant.images
                        .map(extractPublicId)
                        .filter((_id): _id is string => !!_id);
                    await Promise.all(
                        oldImagePublicIds.map((publicId) =>
                            this.uploadService.deleteImage(publicId),
                        ),
                    );
                }
                updateData.images = []; // Đặt mảng ảnh thành rỗng
            }
            // Nếu dto.images không rỗng và không phải file upload mới,
            // giả định đó là các URL ảnh cũ mà client muốn giữ lại.
            // updateData.images sẽ không được cập nhật, và Prisma sẽ tự động giữ lại
            // mảng images hiện có trong DB nếu không có thay đổi.
        }

        // 5. Cập nhật Biến thể trong Cơ sở dữ liệu (không bao gồm variantSizes)
        await this.prisma.variant.update({
            where: { id },
            data: updateData,
        });

        // 6. Xử lý liên kết Kích thước (VariantSize)
        if (dto.variantSizes !== undefined) {
            const variantSizesData: VariantSizeUpdateItemDto[] = dto.variantSizes;

            const sizeIdsFromDto = variantSizesData.map(item => item.sizeId);

            // Xác thực các sizeId có tồn tại trong hệ thống không
            if (sizeIdsFromDto.length > 0) {
                const validSizes = await this.prisma.size.findMany({
                    where: { id: { in: sizeIdsFromDto } },
                });
                if (validSizes.length !== sizeIdsFromDto.length) {
                    const invalidSizeIds = sizeIdsFromDto.filter(
                        (sizeId) => !validSizes.some((s) => s.id === sizeId),
                    );
                    throw new BadRequestException(
                        `Một hoặc nhiều ID kích thước không hợp lệ: ${invalidSizeIds.join(', ')}.`,
                    );
                }
            }

            // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
            await this.prisma.$transaction(async (prisma) => {
                // Xóa tất cả các liên kết size cũ cho biến thể này
                await prisma.variantSize.deleteMany({
                    where: { variantId: id },
                });

                // Tạo các liên kết size mới với số lượng tương ứng
                if (variantSizesData.length > 0) {
                    await prisma.variantSize.createMany({
                        data: variantSizesData.map((item) => ({
                            variantId: id,
                            sizeId: item.sizeId,
                            quantity: item.quantity,
                        })),
                        skipDuplicates: true, // Trong trường hợp có duplicate sizeId trong DTO (nên được xử lý ở DTO validation)
                    });
                }
            });
        }

        // 7. Lấy và trả về Biến thể đã cập nhật
        const finalVariant = await this.prisma.variant.findUnique({
            where: { id },
            include: {
                sizes: { include: { size: true } }, // Bao gồm kích thước chi tiết thông qua VariantSize
                color: true,
            },
        });

        if (!finalVariant) {
            throw new InternalServerErrorException(
                'Không tìm thấy biến thể sau thao tác cập nhật.',
            );
        }

        // Định dạng lại phản hồi để khớp với frontend (sizes với quantity)
        const formattedVariant = {
            ...finalVariant,
            sizes: finalVariant.sizes.map((item) => ({
                id: item.size.id,
                title: item.size.title,
                quantity: item.quantity,
                createdAt: item.size.createdAt,
                updatedAt: item.size.updatedAt,
            })),
        };
        delete (formattedVariant as any).sizes; // Xóa mảng 'sizes' trung gian để tránh trùng lặp

        return {
            success: true,
            message: 'Cập nhật biến thể thành công.',
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
        type VariantWithVariantSizes = Prisma.VariantGetPayload<{
            include: {
                sizes: { // Tên quan hệ trong model Variant là 'sizes'
                    select: {
                        sizeId: true;
                        quantity: true;
                        size: {
                            select: {
                                id: true;
                                title: true;
                            };
                        };
                    };
                };
            };
        }>;

        const variant: VariantWithVariantSizes | null = await this.prisma.variant.findUnique({
            where: { id: variantId },
            include: {
                sizes: {
                    select: {
                        sizeId: true,
                        quantity: true,
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

        const variantSizesWithDetails: VariantSizeDetail[] = variant.sizes.map((vs) => ({
            variantId: variant.id,    // Lấy ID của variant cha
            sizeId: vs.size.id,       // Lấy ID của size thực tế từ đối tượng size lồng trong vs
            title: vs.size.title,     // Lấy tiêu đề của size từ đối tượng size lồng trong vs
            quantity: vs.quantity,    // Lấy số lượng từ bảng trung gian VariantSize
        }));

        return {
            success: true,
            message: `Sizes for variant ID ${variantId} fetched successfully`,
            data: variantSizesWithDetails,
        };
    }

}
