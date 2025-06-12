import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import slugify from 'slugify';
import { UploadService } from 'src/upload/upload.service';
import { extractPublicId } from 'src/utils/file.util';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(dto: CreateBlogDto, userId: number, file?: Express.Multer.File) {
    const slug = slugify(dto.title, { lower: true, strict: true });
    let thumb = dto.thumb;

    if (file) {
      const { secure_url } = await this.uploadService.uploadImage(
        file,
        0,
        'blog',
      );
      thumb = secure_url;
    }
    const isPublishedBoolean = typeof dto.isPublished === 'string'
      ? dto.isPublished === 'true'
      : !!dto.isPublished;

    const blog = await this.prisma.blog.create({
      data: {
        title: dto.title,
        description: dto.description,
        categoryId: Number(dto.categoryId),
        isPublished: isPublishedBoolean, // Sử dụng giá trị boolean hoặc false nếu undefined
        content: typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content, // Serialize array to JSON string for Prisma Json field
        slug,
        createdById: userId,
        thumb,
      },
    });

    return {
      success: true,
      message: 'Blog created successfully',
      data: blog,
    };
  }


  async findAll(page = 1, limit = 10, search = '', categoryId?: number) {
    const skip = (page - 1) * limit;
    const where: Prisma.BlogWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    const [blogs, total] = await this.prisma.$transaction([
      this.prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: {
              id: true,
              title: true,
              slug: true,
              image: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              profilePicture: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.blog.count({ where }),
    ]);

    return {
      success: true,
      message: total > 0 ? 'Blogs found successfully' : 'No blogs found',
      data: blogs,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

  
  async findAllWithoutPagination(search = '',  sortBy?: string,) {
    const where: Prisma.BlogWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    let orderBy: Prisma.BlogOrderByWithRelationInput;
    switch (sortBy) {
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const blogs = await this.prisma.blog.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            role: true,
          },
        },
      },
    });

    return {
      success: true,
      message: blogs.length > 0 ? 'Blogs found successfully' : 'No blogs found',
      data: blogs,
    };
  }

  async findBySlug(slug: string, isPreview = false,  userId?: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            title: true,
            slug: true,
            image: true,
          },
        },
         createdBy: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            role: true,
          },
        },
        likes: {
          select: { id: true }, // lấy id là đủ
        },
        dislikes: {
          select: { id: true },
        },
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');

    if (!isPreview) {
      await this.prisma.blog.update({
        where: { slug },
        data: {
          numberViews: { increment: 1 },
        },
      });
    }

    return {
      success: true,
      message: 'Blog found successfully',
      data: {
        ...blog,
        numberViews: isPreview ? blog.numberViews : blog.numberViews + 1,
        likesCount: blog.likes.length,
        dislikesCount: blog.dislikes.length,
        hasLiked: userId ? blog.likes.some(u => u.id === userId) : false,
        hasDisliked: userId ? blog.dislikes.some(u => u.id === userId) : false,
      },
    };
  }


  async update(id: number, dto: UpdateBlogDto, file?: Express.Multer.File) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    const updateData: any = { ...dto }; // DTO nhận từ FormData sẽ có các giá trị là string

    // Xóa trường 'id' khỏi data nếu nó tồn tại (do FormData gửi lên)
    if (updateData.id !== undefined) {
      delete updateData.id;
    }

    if (dto.slug !== undefined) { // Check if slug is explicitly sent by client
      updateData.slug = dto.slug
    } else if (dto.title) {
      // Priority 2: If no slug is provided but title is updated, generate slug from the new title.
      updateData.slug = slugify(dto.title, { lower: true, strict: true });
    }

    // Xử lý upload ảnh mới
    if (file) {
      const publicId = extractPublicId(blog.thumb);
      if (publicId) {
        await this.uploadService.deleteImage(publicId);
      }
      const { secure_url } = await this.uploadService.uploadImage(
        file,
        id,
        'blog',
      );
      updateData.thumb = secure_url;
    } else if (updateData.thumb === '') {
      // Nếu frontend gửi thumb là chuỗi rỗng, nghĩa là người dùng muốn xóa ảnh
      const publicId = extractPublicId(blog.thumb);
      if (publicId) {
        await this.uploadService.deleteImage(publicId);
      }
      updateData.thumb = null; // Set thumb thành null trong database
    } else {
      // Nếu không có file mới và không có yêu cầu xóa, giữ nguyên ảnh cũ
      delete updateData.thumb; // Đảm bảo không ghi đè ảnh cũ nếu không có thay đổi
    }


    // Parse content nếu là string (từ FormData)
    if (updateData.content && typeof updateData.content === 'string') {
      updateData.content = JSON.parse(updateData.content);
    }

    // Đảm bảo categoryId là số (nếu cần)
    if (updateData.categoryId) {
      updateData.categoryId = Number(updateData.categoryId);
    }

    // Chuyển đổi isPublished từ string sang boolean (từ FormData)
    if (updateData.isPublished !== undefined) {
        updateData.isPublished = updateData.isPublished === 'true';
    }

    const updatedBlog = await this.prisma.blog.update({
      where: { id },
      data: updateData,
    });

    return {
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog,
    };
  }



  async remove(id: number) {
    const blog = await this.prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    const publicId = extractPublicId(blog.thumb);
    if (publicId) await this.uploadService.deleteImage(publicId);

    await this.prisma.blog.delete({ where: { id } });

    return {
      success: true,
      message: 'Blog deleted successfully',
    };
  }

  async likeBlog(blogId: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      include: { likes: true, dislikes: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');

    const isAlreadyLiked = blog.likes.some(u => u.id === userId);
    const isDisliked = blog.dislikes.some(u => u.id === userId);

    await this.prisma.blog.update({
      where: { id: blogId },
      data: {
        likes: isAlreadyLiked
          ? { disconnect: { id: userId } } // unlike
          : { connect: { id: userId } },   // like
        dislikes: isDisliked ? { disconnect: { id: userId } } : undefined, // remove dislike nếu có
      },
    });

    return {
      success: true,
      message: isAlreadyLiked ? 'Blog unliked' : 'Blog liked',
    };
  }

  async dislikeBlog(blogId: number, userId: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id: blogId },
      include: { likes: true, dislikes: true },
    });
    if (!blog) throw new NotFoundException('Blog not found');

    const isDisliked = blog.dislikes.some(u => u.id === userId);
    const isLiked = blog.likes.some(u => u.id === userId);

    await this.prisma.blog.update({
      where: { id: blogId },
      data: {
        dislikes: isDisliked
          ? { disconnect: { id: userId } }
          : { connect: { id: userId } },
        likes: isLiked ? { disconnect: { id: userId } } : undefined,
      },
    });

    return {
      success: true,
      message: isDisliked ? 'Blog undisliked' : 'Blog disliked',
    };
  }
}
