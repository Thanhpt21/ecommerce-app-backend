import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto, ProductSizeDto } from './dto/create-product.dto';
import { ProductSizeUpdateItemDto, UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { extractPublicId } from 'src/utils/file.util';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ProductSizeDetail } from 'src/types/product.type';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name); 
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  // Tạo sản phẩm mới với thumb và images
  async create(
    dto: CreateProductDto,
    files: { thumb?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    if (!dto.title || typeof dto.title !== 'string') {
      throw new BadRequestException('Tiêu đề sản phẩm là bắt buộc và phải là chuỗi.');
    }

    const slug = slugify(dto.title, { lower: true });

    let thumb = dto.thumb;
    let images: string[] = [];

    // Upload thumb nếu có
    if (files?.thumb?.[0]) {
      const { secure_url } = await this.uploadService.uploadImage(
        files.thumb[0],
        0, // ID sản phẩm sẽ được gán sau, tạm thời truyền 0
        'product',
      );
      thumb = secure_url;
    }

    // Upload images nếu có
    if (files?.images?.length) {
      const uploadedImages = await Promise.all(
        files.images.map((file) =>
          this.uploadService.uploadImage(file, 0, 'product'), // ID sản phẩm sẽ được gán sau, tạm thời truyền 0
        ),
      );
      images = uploadedImages.map((img) => img.secure_url);
    }

    // Xử lý tags: đảm bảo là một mảng
    // Giả định dto.tags có thể là string JSON hoặc Array<string>
    const tags = typeof dto.tags === 'string' ? JSON.parse(dto.tags) : dto.tags;

    // Chuyển đổi các trường số sang Number và gán undefined nếu không có
    const numericFields = {
      price: Number(dto.price),
      discount: dto.discount ? Number(dto.discount) : 0,
      brandId: dto.brandId ? Number(dto.brandId) : undefined,
      categoryId: dto.categoryId ? Number(dto.categoryId) : undefined,
      colorId: dto.colorId ? Number(dto.colorId) : undefined,
      // --- Thêm weight vào đây ---
      weight: dto.weight ? Number(dto.weight) : undefined,
    };

    // Kiểm tra thumb phải có
    if (!thumb) throw new BadRequestException('Ảnh thumbnail là bắt buộc.');

     // ⭐ LOGIC CẬP NHẬT: Xử lý  từ chuỗi JSON ⭐
        let parsedProductSizes: ProductSizeDto[] = [];
        if (dto.productSizes) {
            try {
                // Parse chuỗi JSON thành mảng đối tượng
                const rawProductSizes = JSON.parse(dto.productSizes);

                // Nếu bạn muốn validate lại sau khi parse, hãy làm như sau:
                if (!Array.isArray(rawProductSizes)) {
                    throw new BadRequestException('Dữ liệu productSizes phải là một mảng.');
                }

                // Chuyển đổi và validate từng phần tử trong mảng
                const validationErrors: ValidationError[] = [];
                for (const item of rawProductSizes) {
                    const instance = plainToInstance(ProductSizeDto, item);
                    const errors = await validate(instance);
                    if (errors.length > 0) {
                        validationErrors.push(...errors);
                    } else {
                        parsedProductSizes.push(instance);
                    }
                }

                if (validationErrors.length > 0) {
                    this.logger.error('ProductSizes Validation Errors:', validationErrors);
                    // Tạo thông báo lỗi chi tiết hơn từ validationErrors
                    const errorMessages = validationErrors.map(err => Object.values(err.constraints || {})).flat();
                    throw new BadRequestException(`Lỗi validation productSizes: ${errorMessages.join(', ')}`);
                }

            } catch (parseError: any) {
                this.logger.error('Lỗi parse productSizes:', parseError);
                throw new BadRequestException('Dữ liệu productSizes không hợp lệ (không phải JSON hoặc sai cấu trúc).');
            }
        }
    // Tạo product trong database
    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        code: dto.code,
        thumb,
        images,
        status: dto.status ?? 'Còn hàng', // Đặt giá trị mặc định nếu status không được cung cấp
        tags,
        ...numericFields, // Bao gồm price, discount, brandId, categoryId, colorId, weight
        // --- Thêm weightUnit và unit vào đây ---
        weightUnit: dto.weightUnit, // Gán trực tiếp vì đã có IsEnum validate
        unit: dto.unit ?? 'cái', // Gán giá trị mặc định nếu unit không được cung cấp
      },
    });

     // ⭐ LOGIC MỚI: Tạo các bản ghi ProductSize với quantity ⭐
    if (parsedProductSizes.length > 0) {
        await this.prisma.productSize.createMany({
            data: parsedProductSizes.map((ps) => ({
                productId: product.id,
                sizeId: ps.sizeId,
                quantity: ps.quantity ?? 0, // Default quantity to 0 if not provided in DTO
            })),
            skipDuplicates: true,
        });
    }

    // Trả về kết quả kèm theo size (và các quan hệ khác nếu cần)
    const productWithDetails = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        size: { // Bao gồm thông tin size chi tiết
          include: {
            size: true,
          },
        },
        brand: true, // Bao gồm thông tin brand
        category: true, // Bao gồm thông tin category
        color: true, // Bao gồm thông tin color
      },
    });

    return {
      success: true,
      message: 'Sản phẩm đã được tạo thành công.',
      data: productWithDetails,
    };
  }

  // Cập nhật sản phẩm với xử lý upload ảnh
  async update(
    id: number,
    dto: UpdateProductDto,
    files: { thumb?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    // 1. Tìm Sản phẩm và Xác thực ban đầu
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        size: true, // Bao gồm các kích thước hiện có để quản lý chúng
      },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}.`);
    }

    // 2. Chuẩn bị dữ liệu cập nhật
    const updateData: Prisma.ProductUpdateInput = {};

    // Gán các trường trực tiếp từ DTO nếu chúng tồn tại
    // Các trường này đã được ValidationPipe và class-transformer xử lý (kiểu, chuyển đổi)
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.code !== undefined) updateData.code = dto.code;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.title !== undefined) updateData.title = dto.title;

    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.discount !== undefined) updateData.discount = dto.discount;
    if (dto.brandId !== undefined) {
      updateData.brand = dto.brandId === null ? { disconnect: true } : { connect: { id: dto.brandId } };
    }
    if (dto.categoryId !== undefined) {
      updateData.category = dto.categoryId === null ? { disconnect: true } : { connect: { id: dto.categoryId } };
    }
    if (dto.colorId !== undefined) {
      updateData.color = dto.colorId === null ? { disconnect: true } : { connect: { id: dto.colorId } };
    }
    if (dto.weight !== undefined) updateData.weight = dto.weight;
    if (dto.weightUnit !== undefined) updateData.weightUnit = dto.weightUnit;
    if (dto.unit !== undefined) updateData.unit = dto.unit;

    // --- Bắt đầu logic xử lý Slug ---
    const isTitleChanged = dto.title !== undefined && dto.title !== product.title;
    const isSlugManuallyChanged = dto.slug !== undefined && dto.slug !== product.slug;

    let newSlug: string | undefined;

    if (isSlugManuallyChanged) {
      newSlug = dto.slug;
    } else if (isTitleChanged) {
      if (typeof dto.title === 'string') {
        newSlug = slugify(dto.title, { lower: true, strict: true });
      } else {
        // Trường hợp này hiếm khi xảy ra nếu validationPipe hoạt động đúng
        console.error(
          'Lỗi logic: dto.title không phải chuỗi khi isTitleChanged là true.',
        );
        throw new InternalServerErrorException(
          'Lỗi nội bộ khi tạo slug cho sản phẩm.',
        );
      }
    }

    if (newSlug !== undefined && newSlug !== product.slug) {
      const existingProductWithSlug = await this.prisma.product.findUnique({
        where: { slug: newSlug },
      });

      if (existingProductWithSlug && existingProductWithSlug.id !== product.id) {
        throw new BadRequestException(
          `Sản phẩm với slug '${newSlug}' đã tồn tại.`,
        );
      }
      updateData.slug = newSlug;
    } else if (dto.slug !== undefined && dto.slug === product.slug) {
      // Nếu client gửi slug nhưng nó giống với slug hiện có, gán lại để đảm bảo
      updateData.slug = dto.slug;
    }
    // Nếu dto.slug và dto.title đều undefined, slug hiện tại sẽ được giữ nguyên (không gán vào updateData)
    // --- Kết thúc logic xử lý Slug ---

    // Xử lý tags (đã được @Transform trong DTO xử lý nếu gửi qua form-data)
    if (dto.tags !== undefined) {
      updateData.tags = dto.tags;
    }

    // 3. Xử lý tải lên Thumb
    if (files?.thumb?.[0]) {
      // Xóa thumb cũ nếu có
      if (product.thumb) {
        const oldThumbPublicId = extractPublicId(product.thumb);
        if (oldThumbPublicId) {
          await this.uploadService.deleteImage(oldThumbPublicId);
        }
      }
      // Tải lên thumb mới
      const { secure_url } = await this.uploadService.uploadImage(
        files.thumb[0],
        id,
        'product',
      );
      updateData.thumb = secure_url;
    }

    // 4. Xử lý tải lên Images (Thay thế tất cả ảnh hiện có nếu ảnh mới được cung cấp)
    if (files?.images?.length) {
      // Xóa tất cả ảnh cũ
      if (product.images && product.images.length > 0) {
        const oldImagePublicIds = product.images
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
          this.uploadService.uploadImage(file, id, 'product'),
        ),
      );
      updateData.images = uploadedImages.map((img) => img.secure_url);
    } else if (dto.images !== undefined) {
      // Nếu client gửi trường images trong DTO (có thể là mảng rỗng hoặc null)
      // Dto.images đã là string[] hoặc null nhờ class-transformer
      if (dto.images !== null && dto.images.length === 0) {
        // Nếu client muốn xóa tất cả ảnh hiện có (gửi mảng rỗng)
        if (product.images && product.images.length > 0) {
          const oldImagePublicIds = product.images
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


    // 5. Cập nhật Sản phẩm trong Cơ sở dữ liệu
    // Không cần delete thumb/images/slug từ updateData vì chúng đã được xử lý độc lập.
    // Nếu chúng được gán vào updateData (ví dụ: newSlug), Prisma sẽ cập nhật.
    await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

 // 6. Xử lý liên kết Kích thước (ProductSize)
    if (dto.productSizes !== undefined) {
         const productSizesData: ProductSizeUpdateItemDto[] = dto.productSizes; 
    

        const sizeIdsFromDto = productSizesData.map(item => item.sizeId);
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

        await this.prisma.$transaction(async (prisma) => {
            await prisma.productSize.deleteMany({
                where: { productId: id },
            });

            if (productSizesData.length > 0) {
                await prisma.productSize.createMany({
                    data: productSizesData.map((item) => ({
                        productId: id,
                        sizeId: item.sizeId,
                        quantity: item.quantity,
                    })),
                    skipDuplicates: true,
                });
            }
        });
    }

    // 7. Lấy và trả về Sản phẩm đã cập nhật
    const finalProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        size: { include: { size: true } }, // Kích thước của sản phẩm thông qua ProductSize
        brand: true,
        category: true,
        color: true,
      },
    });

    if (!finalProduct) {
      throw new InternalServerErrorException(
        'Không tìm thấy sản phẩm sau thao tác cập nhật.',
      );
    }

    // Định dạng lại phản hồi để khớp với frontend (sizes với quantity)
    const formattedProduct = {
      ...finalProduct,
      sizes: finalProduct.size.map((item) => ({
        id: item.size.id,
        title: item.size.title,
        quantity: item.quantity,
        createdAt: item.size.createdAt,
        updatedAt: item.size.updatedAt,
      })),
    };
    delete (formattedProduct as any).size; // Xóa mảng 'size' trung gian để tránh trùng lặp

    return {
      success: true,
      message: 'Cập nhật sản phẩm thành công.',
      data: formattedProduct,
    };
  }


  async findAll(
    page = 1,
    limit = 10,
    search = '',
    categoryId?: number,
    brandId?: number,
    colorId?: number,
    sortBy?: string,
    price_gte?: number, 
    price_lte?: number, 
  ) {
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    if (categoryId) {
      whereClause.categoryId = Number(categoryId);
    }

    if (brandId) {
      whereClause.brandId = Number(brandId);
    }

    if (colorId) {
      whereClause.colorId = Number(colorId);
    }

     // Thêm lọc theo khoảng giá
    if (price_gte !== undefined || price_lte !== undefined) {
      whereClause.price = {
        ...(price_gte !== undefined && { gte: price_gte }),
        ...(price_lte !== undefined && { lte: price_lte }),
      };
    }
    
     let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

     switch (sortBy) {
      case 'price_asc':
        orderByClause = { price: 'asc' };
        break;
      case 'price_desc':
        orderByClause = { price: 'desc' };
        break;
      case 'created_at_asc':
        orderByClause = { createdAt: 'asc' };
        break;
      case 'created_at_desc':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'averageRating_desc':
        orderByClause = { averageRating: 'desc' };
        break;
      default:
        orderByClause = { createdAt: 'desc' }; // Default sort if sortBy is not recognized
        break;
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          ratings: {
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
          },
          size: { 
              select: { 
                  quantity: true, 
                  size: { 
                      select: {
                          id: true,
                          title: true,
                      },
                  },
              },
          },
          brand: {
            select: {
              id: true,
              title: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
          color: {
            select: {
              id: true,
              title: true,
              code: true,
            },
          },
          variants: {
            include: {
              sizes: { // This is the VariantSize join table
                  select: { // Use select here too for quantity if VariantSize has it
                      quantity: true, // ⭐ Nếu VariantSize cũng có quantity, thêm vào đây ⭐
                      size: {
                          select: {
                              id: true,
                              title: true,
                          },
                      },
                  },
              },
              color: {
                select: {
                  id: true,
                  title: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);


    const result = products.map(({ size, variants, ...rest }) => ({
      ...rest,
      sizes: size.map((s) => ({
        id: s.size.id,
        title: s.size.title,
        quantity: s.quantity, // Lấy quantity từ đối tượng 's' (ProductSize)
      })),
      variants: variants.map((variant) => ({
        ...variant,
         sizes: variant.sizes.map((s) => ({
            id: s.size.id,
            title: s.size.title,
            quantity: s.quantity, // Giả sử VariantSize cũng có quantity
        })),
      })),
    }));

    return {
      success: true,
      message: total > 0 ? 'Products found successfully' : 'No products found',
      data: result,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  async findAllWithoutPagination(search = '') {
    const whereClause: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const products = await this.prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        ratings: {
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
        },
        size: {
          include: {
            size: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        brand: {
          select: {
            id: true,
            title: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        color: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        variants: {
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
            color: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });

    // Áp dụng logic map tương tự như trong findAll để trả về cấu trúc dữ liệu nhất quán
    const result = products.map(({ size, variants, ...rest }) => ({
      ...rest,
      sizes: size.map((s) => s.size), // product-level sizes
      variants: variants.map((variant) => ({
        ...variant,
        sizes: variant.sizes.map((s) => s.size), // variant-level sizes simplified
      })),
    }));

    return {
      success: true,
      message: result.length > 0 ? 'Products found successfully' : 'No products found',
      data: result,
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: {
          select: {
            id: true,
            title: true,
          },
        },
        category: {
          select: {
            id: true,
            title: true,
          },
        },
        color: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
        size: {
          include: {
            size: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        ratings: {
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
        },
        variants: {
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
            color: {
              select: {
                id: true,
                title: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const { size, variants, brandId, categoryId, colorId, ...rest } = product;

    return {
      success: true,
      message: `Product with ID fetched successfully`,
      data: {
        ...rest,
        sizes: size.map((s) => s.size),
        variants: variants.map((variant) => ({
          ...variant,
          sizes: variant.sizes.map((s) => s.size),
        })),
      },
    };
  }

  // Lấy 1 sản phẩm theo slug
  async findBySlug(slug: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { slug },
        include: {
          brand: {
            select: {
              id: true,
              title: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
            },
          },
          color: {
            select: {
              id: true,
              title: true,
              code: true,
            },
          },
          size: {
            include: {
              size: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          ratings: {
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
          },
          variants: {
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
              color: {
                select: {
                  id: true,
                  title: true,
                  code: true,
                },
              },
            },
          },
        },
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const { size, variants, brandId, categoryId, colorId, ...rest } = product;

      const formattedProduct = {
        ...rest,
        sizes: size.map((s) => s.size),
        variants: variants.map((variant) => ({
          ...variant,
          sizes: variant.sizes.map((s) => s.size),
        })),
      };

      return {
        success: true,
        message: 'Product found successfully',
        data: formattedProduct,
      };
    } catch (error) {
      console.error('Error finding product by slug:', error);
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: error.message,
          data: null,
        };
      }
      return {
        success: false,
        message: 'Failed to find product',
        data: null,
      };
    }
  }

  // Xóa sản phẩm và ảnh liên quan
  async remove(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Xóa ảnh thumb nếu có
    const thumbId = extractPublicId(product.thumb);
    if (thumbId) {
      await this.uploadService.deleteImage(thumbId);
    }

    // Xóa ảnh images nếu có
    if (product.images?.length) {
      const imageIds = product.images
        .map(extractPublicId)
        .filter((id): id is string => id !== null);
      await Promise.all(
        imageIds.map((id) => this.uploadService.deleteImage(id)),
      );
    }

    // ✅ XÓA LIÊN KẾT SIZE TRƯỚC
    await this.prisma.productSize.deleteMany({
      where: { productId: id },
    });

    // Sau đó mới xóa product
    await this.prisma.product.delete({ where: { id } });

    return {
      success: true,
      message: 'Product removed successfully',
    };
  }

async getSizesByProductId(productId: number) {
        // Define the specific payload type for your Prisma query to ensure type safety
        type ProductWithProductSizesPayload = Prisma.ProductGetPayload<{
            include: {
                // The relation field name from your Product model is 'size' (singular)
                size: {
                    select: {
                        // Select properties directly from the ProductSize join table
                        sizeId: true;   // ID of the actual Size (e.g., S, M, L)
                        quantity: true; // Quantity of the product for this size

                        // Include the related Size model to get its id and title
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

        const product: ProductWithProductSizesPayload | null = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                // Use the correct relation field name: 'size' (as per your schema.prisma)
                size: {
                    select: {
                        quantity: true, // Select the quantity from the ProductSize model
                        sizeId: true,   // Select the sizeId from ProductSize

                        // This 'size' refers to the actual Size model linked via ProductSize
                        size: {
                            select: {
                                id: true,
                                title: true,
                                // If you need createdAt/updatedAt for the actual Size,
                                // select them here:
                                // createdAt: true,
                                // updatedAt: true,
                            },
                        },
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        // Map the results to match your ProductSizeDetail interface
        // Prisma will return an empty array for `product.size` if no sizes are linked,
        // so no need for the `!Array.isArray()` check here.
        const sizesWithQuantity: ProductSizeDetail[] = product.size.map((ps) => ({
            productId: product.id,    // Get the product's ID
            sizeId: ps.size.id,       // Get the actual size ID from the nested 'size' object
            title: ps.size.title,     // Get the title from the nested 'size' object
            quantity: ps.quantity,    // Get the quantity directly from the 'ProductSize' object (ps)
        }));

        return {
            success: true,
            message: `Sizes for product ID ${productId} fetched successfully`,
            data: sizesWithQuantity,
        };
    }

  async findProductsByCategorySlug(
    categorySlug: string,
    page = 1,
    limit = 10,
    search = '',
    sortBy?: string,
    brandId?: number,   // Thêm brandId
    colorId?: number,   // Thêm colorId
  ) {
    // 1. Tìm Category ID từ Category Slug
    const category = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
      select: { id: true, title: true, slug: true },
    });

    if (!category) {
      return {
        success: true,
        message: 'Category not found, no products to display',
        data: [],
        total: 0,
        page,
        pageCount: 0,
        categoryInfo: null,
      };
    }

    const categoryId = category.id;
    const skip = (page - 1) * limit;

    const whereClause: Prisma.ProductWhereInput = {
      categoryId: categoryId,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
        ],
      }),
      // Đã bỏ logic lọc theo khoảng giá tại đây
    };

     if (brandId) {
      whereClause.brandId = Number(brandId);
    }

    if (colorId) {
      whereClause.colorId = Number(colorId);
    }

    let orderByClause: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price_asc':
        orderByClause = { price: 'asc' };
        break;
      case 'price_desc':
        orderByClause = { price: 'desc' };
        break;
      case 'created_at_asc':
        orderByClause = { createdAt: 'asc' };
        break;
      case 'created_at_desc':
        orderByClause = { createdAt: 'desc' };
        break;
      case 'sold_desc':
        orderByClause = { sold: 'desc' };
        break;
      case 'averageRating_desc':
        orderByClause = { averageRating: 'desc' };
        break;
      default:
        orderByClause = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: orderByClause,
        include: {
          ratings: {
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
          },
          size: {
            include: {
              size: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
          brand: {
            select: {
              id: true,
              title: true,
            },
          },
          category: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
          color: {
            select: {
              id: true,
              title: true,
              code: true,
            },
          },
          variants: {
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
              color: {
                select: {
                  id: true,
                  title: true,
                  code: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);

    const result = products.map(({ size, variants, ...rest }) => ({
      ...rest,
      sizes: size.map((s) => s.size),
      variants: variants.map((variant) => ({
        ...variant,
        sizes: variant.sizes.map((s) => s.size),
      })),
    }));

    return {
      success: true,
      message: total > 0 ? 'Products found successfully' : 'No products found',
      data: result,
      total,
      page,
      pageCount: Math.ceil(total / limit),
      categoryInfo: category,
    };
  }
  



}
