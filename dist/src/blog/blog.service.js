"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let BlogService = class BlogService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, userId, file) {
        const slug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        let thumb = dto.thumb;
        if (file) {
            const { secure_url } = await this.uploadService.uploadImage(file, 0, 'blog');
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
                isPublished: isPublishedBoolean,
                content: typeof dto.content === 'string' ? JSON.parse(dto.content) : dto.content,
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
    async findAll(page = 1, limit = 10, search = '', categoryId) {
        const skip = (page - 1) * limit;
        const where = {};
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
    async findAllWithoutPagination(search = '', sortBy) {
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        let orderBy;
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
    async findBySlug(slug, isPreview = false, userId) {
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
                    select: { id: true },
                },
                dislikes: {
                    select: { id: true },
                },
            },
        });
        if (!blog)
            throw new common_1.NotFoundException('Blog not found');
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
    async update(id, dto, file) {
        const blog = await this.prisma.blog.findUnique({ where: { id } });
        if (!blog)
            throw new common_1.NotFoundException('Blog not found');
        const updateData = { ...dto };
        if (updateData.id !== undefined) {
            delete updateData.id;
        }
        if (dto.slug !== undefined) {
            updateData.slug = dto.slug;
        }
        else if (dto.title) {
            updateData.slug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        }
        if (file) {
            const publicId = (0, file_util_1.extractPublicId)(blog.thumb);
            if (publicId) {
                await this.uploadService.deleteImage(publicId);
            }
            const { secure_url } = await this.uploadService.uploadImage(file, id, 'blog');
            updateData.thumb = secure_url;
        }
        else if (updateData.thumb === '') {
            const publicId = (0, file_util_1.extractPublicId)(blog.thumb);
            if (publicId) {
                await this.uploadService.deleteImage(publicId);
            }
            updateData.thumb = null;
        }
        else {
            delete updateData.thumb;
        }
        if (updateData.content && typeof updateData.content === 'string') {
            updateData.content = JSON.parse(updateData.content);
        }
        if (updateData.categoryId) {
            updateData.categoryId = Number(updateData.categoryId);
        }
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
    async remove(id) {
        const blog = await this.prisma.blog.findUnique({ where: { id } });
        if (!blog)
            throw new common_1.NotFoundException('Blog not found');
        const publicId = (0, file_util_1.extractPublicId)(blog.thumb);
        if (publicId)
            await this.uploadService.deleteImage(publicId);
        await this.prisma.blog.delete({ where: { id } });
        return {
            success: true,
            message: 'Blog deleted successfully',
        };
    }
    async likeBlog(blogId, userId) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId },
            include: { likes: true, dislikes: true },
        });
        if (!blog)
            throw new common_1.NotFoundException('Blog not found');
        const isAlreadyLiked = blog.likes.some(u => u.id === userId);
        const isDisliked = blog.dislikes.some(u => u.id === userId);
        await this.prisma.blog.update({
            where: { id: blogId },
            data: {
                likes: isAlreadyLiked
                    ? { disconnect: { id: userId } }
                    : { connect: { id: userId } },
                dislikes: isDisliked ? { disconnect: { id: userId } } : undefined,
            },
        });
        return {
            success: true,
            message: isAlreadyLiked ? 'Blog unliked' : 'Blog liked',
        };
    }
    async dislikeBlog(blogId, userId) {
        const blog = await this.prisma.blog.findUnique({
            where: { id: blogId },
            include: { likes: true, dislikes: true },
        });
        if (!blog)
            throw new common_1.NotFoundException('Blog not found');
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
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], BlogService);
//# sourceMappingURL=blog.service.js.map