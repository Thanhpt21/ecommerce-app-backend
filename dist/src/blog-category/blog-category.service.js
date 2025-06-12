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
exports.BlogCategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let BlogCategoryService = class BlogCategoryService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, file) {
        let imageUrl = undefined;
        if (file) {
            const { secure_url } = await this.uploadService.uploadImage(file, 0, 'blog-category');
            imageUrl = secure_url;
        }
        const newCategory = await this.prisma.blogCategory.create({
            data: {
                ...dto,
                slug: (0, slugify_1.default)(dto.title, { lower: true, strict: true }),
                image: imageUrl,
            },
        });
        return {
            success: true,
            message: 'Blog category created successfully',
            data: newCategory,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [categories, total] = await this.prisma.$transaction([
            this.prisma.blogCategory.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.blogCategory.count({ where: whereClause }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Blog categories found successfully' : 'No blog categories found',
            data: categories,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findAllWithoutPagination(search = '') {
        const where = search
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
    async findOne(id) {
        const category = await this.prisma.blogCategory.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return {
            success: true,
            message: 'Category found successfully',
            data: category,
        };
    }
    async update(id, dto, file) {
        const blogCategory = await this.prisma.blogCategory.findUnique({ where: { id } });
        if (!blogCategory) {
            throw new common_1.NotFoundException('Blog Category not found');
        }
        const updateData = { ...dto };
        if (dto.slug !== undefined) {
            updateData.slug = dto.slug;
        }
        else if (dto.title) {
            updateData.slug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        }
        if (file) {
            const currentPublicId = (0, file_util_1.extractPublicId)(blogCategory.image);
            if (currentPublicId) {
                await this.uploadService.deleteImage(currentPublicId);
            }
            const { secure_url, public_id } = await this.uploadService.uploadImage(file, id, 'blog-category');
            updateData.image = secure_url;
        }
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
    async remove(id) {
        const blogCategory = await this.prisma.blogCategory.findUnique({ where: { id } });
        if (!blogCategory) {
            throw new common_1.NotFoundException('Blog Category not found');
        }
        const publicId = (0, file_util_1.extractPublicId)(blogCategory.image);
        if (publicId) {
            await this.uploadService.deleteImage(publicId);
        }
        await this.prisma.blogCategory.delete({ where: { id } });
        return {
            success: true,
            message: 'Blog Category removed successfully',
        };
    }
};
exports.BlogCategoryService = BlogCategoryService;
exports.BlogCategoryService = BlogCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, upload_service_1.UploadService])
], BlogCategoryService);
//# sourceMappingURL=blog-category.service.js.map