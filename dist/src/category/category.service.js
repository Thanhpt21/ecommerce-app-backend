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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const slugify_1 = require("slugify");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let CategoryService = class CategoryService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, file) {
        const slug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        let image = dto.image;
        if (file) {
            const { secure_url, public_id } = await this.uploadService.uploadImage(file, 0, 'category');
            image = secure_url;
        }
        const newCategory = await this.prisma.category.create({ data: { ...dto, slug, image } });
        return {
            success: true,
            message: 'Category created successfully',
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
        const whereClause = search
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
            message: categories.length > 0
                ? 'Categories found successfully'
                : 'No categories found',
            data: categories,
            total: categories.length,
        };
    }
    async findOne(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category)
            throw new common_1.NotFoundException('Category not found');
        return {
            success: true,
            message: 'Category found successfully',
            data: category,
        };
    }
    async update(id, dto, file) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const updateData = { ...dto };
        if (dto.slug !== undefined) {
            updateData.slug = dto.slug;
        }
        else if (dto.title) {
            const newSlug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
            updateData.slug = newSlug;
            const existingCategoryWithSlug = await this.prisma.category.findUnique({
                where: { slug: newSlug },
            });
            if (existingCategoryWithSlug && existingCategoryWithSlug.id !== id) {
                throw new common_1.BadRequestException(`Category with slug '${newSlug}' already exists.`);
            }
        }
        if (file) {
            const currentPublicId = (0, file_util_1.extractPublicId)(category.image);
            if (currentPublicId) {
                await this.uploadService.deleteImage(currentPublicId);
            }
            const { secure_url } = await this.uploadService.uploadImage(file, id, 'category');
            updateData.image = secure_url;
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
    async remove(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const publicId = (0, file_util_1.extractPublicId)(category.image);
        if (publicId) {
            await this.uploadService.deleteImage(publicId);
        }
        await this.prisma.category.delete({ where: { id } });
        return {
            success: true,
            message: 'Category removed successfully',
        };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, upload_service_1.UploadService])
], CategoryService);
//# sourceMappingURL=category.service.js.map