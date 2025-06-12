import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { UploadService } from 'src/upload/upload.service';
import { extractPublicId } from 'src/utils/file.util';

@Injectable()
export class BlogCategoryService {
  constructor(private readonly prisma: PrismaService, private uploadService: UploadService) {}

async create(dto: CreateBlogCategoryDto, file?: Express.Multer.File) {
  let imageUrl: string | undefined = undefined;
  

  // Nếu có ảnh, upload
  if (file) {
    const { secure_url } = await this.uploadService.uploadImage(file, 0, 'blog-category')
    imageUrl = secure_url
  }

  const newCategory = await this.prisma.blogCategory.create({
    data: {
      ...dto,
      slug: slugify(dto.title, { lower: true, strict: true }),
      image: imageUrl, // có thể là undefined
    },
  })

  return {
    success: true,
    message: 'Blog category created successfully',
    data: newCategory,
  }
}

async findAll(page: number = 1, limit: number = 10, search: string = '') {
    const skip = (page - 1) * limit;

    // Xây dựng câu lệnh WHERE cho tìm kiếm
    const whereClause: Prisma.BlogCategoryWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },  // Tìm kiếm theo tên category
            { slug: { contains: search, mode: 'insensitive' } },  // Tìm kiếm theo slug (nếu có)
          ],
        }
      : {};

    // Thực hiện query với phân trang và tìm kiếm
    const [categories, total] = await this.prisma.$transaction([
      this.prisma.blogCategory.findMany({
        where: whereClause,  // Điều kiện tìm kiếm
        skip,  // Phân trang: bỏ qua các mục từ trang trước
        take: limit,  // Giới hạn số mục trên mỗi trang
        orderBy: { createdAt: 'desc' },  // Sắp xếp theo thời gian tạo (có thể thay đổi theo yêu cầu)
      }),
      this.prisma.blogCategory.count({ where: whereClause }),  // Đếm tổng số blog categories thỏa mãn điều kiện tìm kiếm
    ]);

    // Trả về kết quả với phân trang
    return {
      success: true,
      message: total > 0 ? 'Blog categories found successfully' : 'No blog categories found',
      data: categories,
      total,
      page,
      pageCount: Math.ceil(total / limit),  // Tính tổng số trang
    };
  }

  async findAllWithoutPagination(search = '') {
    const where: Prisma.BlogCategoryWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const categories = await this.prisma.blogCategory.findMany({
      where,
      orderBy: { title: 'asc' },
    });

    return {
      success: true,
      message: categories.length > 0 ? 'Blog categories found successfully' : 'No blog categories found',
      data: categories,
    };
  }

  async findOne(id: number) {
    const category = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return {
      success: true,
      message: 'Category found successfully',
      data: category,
    };
  }

  async update(id: number, dto: UpdateBlogCategoryDto, file?: Express.Multer.File) {
      const blogCategory = await this.prisma.blogCategory.findUnique({ where: { id } });
      if (!blogCategory) {
        throw new NotFoundException('Blog Category not found');
      }

      const updateData: any = { ...dto };
      if (dto.slug !== undefined) { // Check if slug is explicitly sent by client
        updateData.slug = dto.slug
      } else if (dto.title) {
        // Priority 2: If no slug is provided but title is updated, generate slug from the new title.
        updateData.slug = slugify(dto.title, { lower: true, strict: true });
      }

      // Nếu có file ảnh mới, xử lý ảnh
      if (file) {
        // Xóa ảnh cũ nếu có
        const currentPublicId = extractPublicId(blogCategory.image);  // Giả sử bạn có hàm extractPublicId
        if (currentPublicId) {
          await this.uploadService.deleteImage(currentPublicId); // Xóa ảnh cũ
        }

        const { secure_url, public_id } = await this.uploadService.uploadImage(file, id, 'blog-category');
        updateData.image = secure_url; // Cập nhật URL ảnh mới
      }

      // Cập nhật blog category
      const updatedBlogCategory = await this.prisma.blogCategory.update({
        where: { id },
        data: updateData,
      });

      return {
        success: true,
        message: 'Blog Category updated successfully',
        data: updatedBlogCategory,
      };
    }

  // Xóa blog category
  async remove(id: number) {
    const blogCategory = await this.prisma.blogCategory.findUnique({ where: { id } });
    if (!blogCategory) {
      throw new NotFoundException('Blog Category not found');
    }

    // Nếu blog category có ảnh, xóa ảnh khỏi Cloudinary (hoặc dịch vụ lưu trữ)
    const publicId = extractPublicId(blogCategory.image); // Lấy publicId từ URL ảnh
    if (publicId) {
      await this.uploadService.deleteImage(publicId); // Xóa ảnh từ Cloudinary
    }

    // Xóa blog category khỏi cơ sở dữ liệu
    await this.prisma.blogCategory.delete({ where: { id } });

    return {
      success: true,
      message: 'Blog Category removed successfully',
    };
  }

}
