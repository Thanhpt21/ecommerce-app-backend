import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { extractPublicId } from 'src/utils/file.util';

@Injectable()
export class ProductService {
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
      throw new BadRequestException('Title is required and must be a string');
    }
    const slug = slugify(dto.title, { lower: true });

    let thumb = dto.thumb;
    let images: string[] = [];

    // Upload thumb nếu có
    if (files?.thumb?.[0]) {
      const { secure_url } = await this.uploadService.uploadImage(
        files.thumb[0],
        0,
        'product',
      );
      thumb = secure_url;
    }

    // Upload images nếu có
    if (files?.images?.length) {
      const uploadedImages = await Promise.all(
        files.images.map((file) =>
          this.uploadService.uploadImage(file, 0, 'product'),
        ),
      );
      images = uploadedImages.map((img) => img.secure_url);
    }

    const tags = typeof dto.tags === 'string' ? JSON.parse(dto.tags) : dto.tags;

    const numericFields = {
      price: Number(dto.price),
      discount: dto.discount ? Number(dto.discount) : 0,
      brandId: dto.brandId ? Number(dto.brandId) : undefined,
      categoryId: dto.categoryId ? Number(dto.categoryId) : undefined,
      colorId: dto.colorId ? Number(dto.colorId) : undefined,
    };

    if (!thumb) throw new BadRequestException('Thumb is required');

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

    // Tạo product trước
    const product = await this.prisma.product.create({
      data: {
        title: dto.title,
        slug,
        description: dto.description,
        code: dto.code,
        thumb,
        images,
        status: dto.status ?? 'Còn hàng',
        tags,
        ...numericFields,
      },
    });

    // Thêm quan hệ size nếu có
    if (sizeIds.length > 0) {
      await this.prisma.productSize.createMany({
        data: sizeIds.map((sizeId) => ({
          productId: product.id,
          sizeId,
        })),
        skipDuplicates: true,
      });
    }

    // Trả về kết quả kèm theo size nếu muốn
    const productWithSizes = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        size: {
          include: {
            size: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Product created successfully',
      data: productWithSizes,
    };
  }

  // Cập nhật sản phẩm với xử lý upload ảnh
  async update(
    id: number,
    dto: UpdateProductDto,
    files: { thumb?: Express.Multer.File[]; images?: Express.Multer.File[] },
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        size: true,
      },
    });
    if (!product) throw new NotFoundException('Product not found');

    const updateData: any = { ...dto };

    if (dto.tags) {
      const tagsInput = dto.tags as string | string[];
      updateData.tags = Array.isArray(tagsInput)
        ? tagsInput.map(tag => tag.trim())
        : (tagsInput as string).split(',').map(tag => tag.trim());
    }

    if (dto.slug !== undefined) { // Check if slug is explicitly sent by client
      updateData.slug = dto.slug
    } else if (dto.title) {
      // Priority 2: If no slug is provided but title is updated, generate slug from the new title.
      updateData.slug = slugify(dto.title, { lower: true, strict: true });
    }

    let thumbUrl = product.thumb;
    let newImagesUrls: string[] = [...product.images];

    // Upload thumb mới nếu có
    if (files?.thumb?.[0]) {
      const oldThumbId = extractPublicId(product.thumb);
      if (oldThumbId) await this.uploadService.deleteImage(oldThumbId);

      const { secure_url } = await this.uploadService.uploadImage(
        files.thumb[0],
        id,
        'product',
      );
      thumbUrl = secure_url;
      updateData.thumb = thumbUrl;
    }

    // Upload lại images nếu có
    if (files?.images?.length) {
      const oldImageIds = product.images
        .map(extractPublicId)
        .filter((imageId): imageId is string => !!imageId);
      await Promise.all(
        oldImageIds.map((oldId) => this.uploadService.deleteImage(oldId)),
      );

      const uploaded = await Promise.all(
        files.images.map((file) => this.uploadService.uploadImage(file, id, 'product')),
      );
      newImagesUrls = uploaded.map((file) => file.secure_url);
      updateData.images = newImagesUrls;
    }

    // Đảm bảo các field số nếu undefined thì không lỗi Prisma
    const numericFields = ['price', 'discount', 'brandId', 'categoryId', 'colorId'].reduce(
      (acc, field) => {
        if (dto[field] !== undefined) acc[field] = Number(dto[field]);
        return acc;
      },
      {},
    );
    Object.assign(updateData, numericFields);
    delete updateData.sizeIds; // Xóa tạm thời để xử lý sau

    // Cập nhật bản ghi chính (không bao gồm sizeIds, images nếu files được upload)
    const updatePayload: any = { ...updateData };
    if (files?.thumb?.[0]) updatePayload.thumb = thumbUrl;
    if (files?.images?.length) updatePayload.images = newImagesUrls;

    await this.prisma.product.update({
      where: { id },
      data: updatePayload,
    });

    // Xử lý sizeIds - đảm bảo parse đúng từ JSON string
    let sizeIdsToProcess: number[] = [];
    if (dto.sizeIds) {
      try {
        // Xử lý cả trường hợp là array hoặc JSON string
        sizeIdsToProcess = Array.isArray(dto.sizeIds)
          ? dto.sizeIds
          : JSON.parse(dto.sizeIds as string);

        // Đảm bảo là mảng number và loại bỏ giá trị không hợp lệ
        sizeIdsToProcess = sizeIdsToProcess
          .map(id => Number(id))
          .filter(id => !isNaN(id) && id > 0);
      } catch (error) {
        throw new BadRequestException('Invalid sizeIds format');
      }
    }

    // Xóa các productSize cũ
    await this.prisma.productSize.deleteMany({
      where: { productId: id },
    });

    // Tạo mới các productSize
    if (sizeIdsToProcess.length > 0) {
      await this.prisma.productSize.createMany({
        data: sizeIdsToProcess.map((sizeId) => ({
          productId: id,
          sizeId,
        })),
        skipDuplicates: true,
      });
    }

    // Lấy lại sản phẩm đã cập nhật cùng size
    const finalProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        size: { include: { size: true } },
      },
    });

    if (!finalProduct) {
      throw new InternalServerErrorException('Product not found after update');
    }

    const formattedProduct = {
      ...finalProduct,
      sizes: finalProduct.size.map((item) => item.size),
    };
    delete (formattedProduct as any).size;

    return {
      success: true,
      message: 'Product updated successfully',
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
      }),
      this.prisma.product.count({ where: whereClause }),
    ]);


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
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
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
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const sizes = product.size.map((ps) => ps.size);

    return {
      success: true,
      message: `Sizes for product ID ${productId} fetched successfully`,
      data: sizes,
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
