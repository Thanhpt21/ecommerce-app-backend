import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { UploadService } from 'src/upload/upload.service';
import { extractPublicId } from 'src/utils/file.util';


@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService, private uploadService: UploadService) {}

  async create(dto: CreateCategoryDto, file?: Express.Multer.File) {
    const slug = slugify(dto.title, { lower: true, strict: true });
    let image = dto.image;

    // Nếu có file ảnh được upload, sử dụng UploadService để upload ảnh
    if (file) {
      const { secure_url, public_id } = await this.uploadService.uploadImage(file, 0, 'category');
      image = secure_url; // Lưu URL của ảnh đã được upload
    }

    // Tạo category mới trong cơ sở dữ liệu
    const newCategory = await this.prisma.category.create({ data: { ...dto, slug, image } });

    return {
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    };
  }


  async findAll(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    const whereClause: Prisma.CategoryWhereInput = search
        ? {
            OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            ],
        }
        : {};

    const [categories, total] = await this.prisma.$transaction([
        this.prisma.category.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        }),
        this.prisma.category.count({ where: whereClause }),
    ]);

    return {
        success: true,
        message: total > 0 ? 'Categories found successfully' : 'No categories found',
        data: categories,
        total,
        page,
        pageCount: Math.ceil(total / limit),
    };
  }

  async findAllWithoutPagination(search = '') {
    const whereClause: Prisma.CategoryWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const categories = await this.prisma.category.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message:
        categories.length > 0
          ? 'Categories found successfully'
          : 'No categories found',
      data: categories,
      total: categories.length,
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return {
        success: true,
        message: 'Category found successfully',
        data: category,
    };
  }

async update(id: number, dto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const updateData: any = { ...dto };

    // Bắt đầu thêm logic cập nhật slug
    // Nếu title được cung cấp trong DTO, hãy tạo slug mới từ title đó

    if (dto.slug !== undefined) { // Check if slug is explicitly sent by client
          updateData.slug = dto.slug
        } else if (dto.title) {
         const newSlug = slugify(dto.title, { lower: true, strict: true}); // Sử dụng locale 'vi' nếu cần
      updateData.slug = newSlug;

      // Kiểm tra xem slug mới có bị trùng với slug của danh mục khác không
      const existingCategoryWithSlug = await this.prisma.category.findUnique({
        where: { slug: newSlug },
      });

      // Nếu tìm thấy danh mục khác có cùng slug VÀ đó không phải là danh mục đang được cập nhật
      if (existingCategoryWithSlug && existingCategoryWithSlug.id !== id) {
        throw new BadRequestException(`Category with slug '${newSlug}' already exists.`);
      }
    }

    if (file) {
      const currentPublicId = extractPublicId(category.image); // Sử dụng hàm helper ở đây
      if (currentPublicId) {
        await this.uploadService.deleteImage(currentPublicId); // Xóa ảnh cũ
      }

      const { secure_url } = await this.uploadService.uploadImage(file, id, 'category'); // Không cần public_id nếu không lưu vào DB
      updateData.image = secure_url; // Cập nhật URL ảnh mới
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }



    async remove(id: number) {
      const category = await this.prisma.category.findUnique({ where: { id } });
      if (!category) {
          throw new NotFoundException('Category not found');
      }

      // Nếu category có ảnh, xóa ảnh khỏi Cloudinary (hoặc dịch vụ lưu trữ)
      const publicId = extractPublicId(category.image); // Lấy publicId từ URL ảnh
      if (publicId) {
          await this.uploadService.deleteImage(publicId); // Xóa ảnh từ Cloudinary
      }

      await this.prisma.category.delete({ where: { id } });

      return {
          success: true,
          message: 'Category removed successfully',
      };
    }



}
