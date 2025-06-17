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
    let sizeIds: number[] = dto.sizeIds || []; // Đảm bảo nó là một mảng, mặc định là rỗng nếu undefined

    if (sizeIds.length > 0) {
        const validSizes = await this.prisma.size.findMany({
            where: { id: { in: sizeIds } },
        });
        if (validSizes.length !== sizeIds.length) {
            throw new BadRequestException('Một số sizeIds không hợp lệ');
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
    // 1. Tìm Sản phẩm và Xác thực ban đầu
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        size: true, // Bao gồm các kích thước hiện có để quản lý chúng
      },
    });

    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID ${id}`);
    }

    // 2. Chuẩn bị dữ liệu cập nhật
    // Sử dụng partial để cho phép các trường không bắt buộc
    const updateData: Prisma.ProductUpdateInput = {};

    // Gán các trường trực tiếp từ DTO nếu chúng tồn tại (trừ những trường cần xử lý đặc biệt)
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.code !== undefined) updateData.code = dto.code;
    if (dto.status !== undefined) updateData.status = dto.status; // Nếu có trường status


    // --- Bắt đầu logic xử lý Slug (Tích hợp trực tiếp) ---
    const isTitleChanged = dto.title !== undefined && dto.title !== product.title;
    const isSlugManuallyChanged = dto.slug !== undefined && dto.slug !== product.slug;

    let newSlug: string | undefined; // Biến tạm để lưu slug mới

    if (isSlugManuallyChanged) {
        newSlug = dto.slug;
    } else if (isTitleChanged) {
        if (typeof dto.title === 'string') {
            newSlug = slugify(dto.title, { lower: true, strict: true });
        } else {
            console.error("Logic error: dto.title is not a string when isTitleChanged is true.");
            throw new InternalServerErrorException("Lỗi logic nội bộ khi tạo slug cho sản phẩm.");
        }
    }
    // Nếu cả title và slug đều không thay đổi hoặc không được cung cấp, newSlug sẽ là undefined.

    // Gán slug vào updateData nếu có slug mới hoặc nếu DTO có slug và nó khác slug hiện tại của sản phẩm
    if (newSlug !== undefined && newSlug !== product.slug) {
        // Kiểm tra tính duy nhất của slug MỚI
        const existingProductWithSlug = await this.prisma.product.findUnique({
            where: { slug: newSlug },
        });

        if (existingProductWithSlug && existingProductWithSlug.id !== product.id) {
            throw new BadRequestException(`Sản phẩm với slug '${newSlug}' đã tồn tại.`);
        }
        updateData.slug = newSlug;
    } else if (dto.slug !== undefined && dto.slug === product.slug) {
        // Nếu client gửi slug nhưng nó giống với slug hiện có, không làm gì cả
        // Hoặc có thể gán lại để đảm bảo (tùy thuộc vào thiết kế backend)
        updateData.slug = dto.slug;
    } else if (dto.slug === undefined && dto.title === undefined) {
        // Nếu không có title hay slug trong DTO, giữ nguyên slug hiện tại của sản phẩm
        updateData.slug = product.slug;
    }
    // --- Kết thúc logic xử lý Slug ---


    // Xử lý tags
    if (dto.tags) {
      try {
        updateData.tags =
          typeof dto.tags === 'string' ? JSON.parse(dto.tags) : dto.tags;
      } catch (error) {
        throw new BadRequestException('Định dạng tags không hợp lệ');
      }
    }


    // Chuyển đổi và xác thực các trường số
    ['price', 'discount', 'brandId', 'categoryId', 'colorId'].forEach((field) => {
      // Chỉ xử lý nếu trường đó có trong DTO
      if (dto[field as keyof UpdateProductDto] !== undefined) {
        if (dto[field as keyof UpdateProductDto] === null) {
          // Nếu client gửi null, gán null (ví dụ để xóa brandId)
          (updateData as any)[field] = null;
        } else {
          const value = Number(dto[field as keyof UpdateProductDto]);
          if (isNaN(value)) {
            throw new BadRequestException(`${field} phải là một số hợp lệ.`);
          }
          (updateData as any)[field] = value;
        }
      }
    });

    // 3. Xử lý tải lên Thumb
    if (files?.thumb?.[0]) {
      // Delete old thumbnail if it exists
      if (product.thumb) {
        const oldThumbPublicId = extractPublicId(product.thumb);
        if (oldThumbPublicId) {
          await this.uploadService.deleteImage(oldThumbPublicId);
        }
      }
      // Upload new thumbnail
      const {
        secure_url
      } = await this.uploadService.uploadImage(
        files.thumb[0],
        id,
        'product',
      );
      updateData.thumb = secure_url;
    }


    // 4. Xử lý tải lên Images (Thay thế tất cả ảnh hiện có nếu ảnh mới được cung cấp)
    if (files?.images?.length) { // Nếu có file ảnh mới được tải lên
      // Xóa tất cả ảnh cũ
      if (product.images && product.images.length > 0) {
        const oldImagePublicIds = product.images
          .map(extractPublicId)
          .filter((id): id is string => !!id);
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
    } else if (dto.images !== undefined) { // Nếu client gửi trường images trong DTO (có thể là mảng rỗng hoặc null)
        let clientImagesValue: string[] | null = null;
        if (typeof dto.images === 'string') {
            try {
                clientImagesValue = JSON.parse(dto.images);
                if (!Array.isArray(clientImagesValue)) {
                    throw new Error('Parsed images is not an array.');
                }
            } catch (e) {
                throw new BadRequestException('Định dạng images không hợp lệ. Phải là mảng chuỗi JSON hoặc null.');
            }
        } else if (Array.isArray(dto.images)) {
            clientImagesValue = dto.images;
        } else if (dto.images === null) {
            clientImagesValue = null;
        }

        if (clientImagesValue !== null && clientImagesValue.length === 0) {
            // Nếu client muốn xóa tất cả ảnh hiện có (gửi mảng rỗng)
            if (product.images && product.images.length > 0) {
                const oldImagePublicIds = product.images
                    .map(extractPublicId)
                    .filter((id): id is string => !!id);
                await Promise.all(
                    oldImagePublicIds.map((publicId) =>
                        this.uploadService.deleteImage(publicId),
                    ),
                );
            }
            updateData.images = []; // Đặt mảng ảnh thành rỗng
        }
        // Nếu clientImagesValue không rỗng, chúng ta giả định đó là các URL ảnh cũ mà client muốn giữ lại.
        // Trong trường hợp này, updateData.images sẽ không được cập nhật,
        // và Prisma sẽ tự động giữ lại mảng images hiện có trong DB.
        // HƯỚNG DẪN: Nếu bạn muốn client gửi lại TẤT CẢ các URL ảnh mà họ muốn giữ, bạn sẽ cần logic phức tạp hơn
        // để so sánh và chỉ xóa những ảnh không còn trong danh sách mới.
        // Cách hiện tại: chỉ xóa nếu có file mới HOẶC client gửi rõ ràng mảng rỗng.
    }


    // 5. Cập nhật Sản phẩm trong Cơ sở dữ liệu
    // Loại bỏ sizeIds khỏi updateData trước khi update product chính
    delete (updateData as any).sizeIds;
    // Đảm bảo không ghi đè các trường đã được xử lý bằng file upload
    delete (updateData as any).thumb; // Đã xử lý riêng
    delete (updateData as any).images; // Đã xử lý riêng
    // delete (updateData as any).slug; // Đã xử lý nếu có newSlug, nếu không sẽ là dto.slug hoặc product.slug

    await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    // 6. Xử lý liên kết Kích thước
    if (dto.sizeIds !== undefined) { // Chỉ xử lý nếu sizeIds được cung cấp trong DTO
      let sizeIdsToProcess: number[] = [];
      try {
        sizeIdsToProcess = Array.isArray(dto.sizeIds)
          ? dto.sizeIds.map(Number)
          : JSON.parse(dto.sizeIds as string).map(Number);

        // Lọc bỏ các số không hợp lệ và đảm bảo tất cả đều hợp lệ
        sizeIdsToProcess = sizeIdsToProcess.filter((sId) => !isNaN(sId) && sId > 0);

        // Xác thực tất cả các sizeIds được cung cấp tồn tại trong bảng Size
        if (sizeIdsToProcess.length > 0) {
          const validSizes = await this.prisma.size.findMany({
            where: { id: { in: sizeIdsToProcess } },
          });
          if (validSizes.length !== sizeIdsToProcess.length) {
            throw new BadRequestException('Một hoặc nhiều sizeIds được cung cấp không hợp lệ.');
          }
        }
      } catch (error) {
        throw new BadRequestException('Định dạng hoặc giá trị sizeIds không hợp lệ.');
      }

      // Sử dụng transaction để đảm bảo tính nguyên tử khi cập nhật quan hệ
      await this.prisma.$transaction([
        this.prisma.productSize.deleteMany({
          where: { productId: id },
        }),
        this.prisma.productSize.createMany({
          data: sizeIdsToProcess.map((sizeId) => ({
            productId: id,
            sizeId,
          })),
          skipDuplicates: true,
        }),
      ]);
    }


    // 7. Lấy và trả về Sản phẩm đã cập nhật
    const finalProduct = await this.prisma.product.findUnique({
      where: { id },
      include: {
        size: { include: { size: true } },
      },
    });

    if (!finalProduct) {
      throw new InternalServerErrorException('Không tìm thấy sản phẩm sau thao tác cập nhật.');
    }

    // Định dạng lại phản hồi để khớp với cấu trúc 'data' của phương thức create
    const formattedProduct = {
      ...finalProduct,
      sizes: finalProduct.size.map((item) => item.size),
    };
    delete (formattedProduct as any).size; // Xóa mảng 'size' trung gian

    return {
      success: true,
      message: 'Cập nhật sản phẩm thành công',
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
