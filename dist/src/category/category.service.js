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
        let imageUrl = dto.image;
        if (dto.parentId) {
            const parentCategory = await this.prisma.category.findUnique({ where: { id: dto.parentId } });
            if (!parentCategory) {
                throw new common_1.NotFoundException(`Danh mục cha với ID ${dto.parentId} không tìm thấy.`);
            }
        }
        const existingCategory = await this.prisma.category.findUnique({ where: { slug } });
        if (existingCategory) {
            throw new common_1.BadRequestException(`Danh mục với slug '${slug}' đã tồn tại.`);
        }
        if (file) {
            const { secure_url } = await this.uploadService.uploadImage(file, 0, 'category');
            imageUrl = secure_url;
        }
        const newCategory = await this.prisma.category.create({
            data: {
                title: dto.title,
                slug,
                image: imageUrl,
                parentId: dto.parentId,
            },
        });
        return {
            success: true,
            message: 'Danh mục đã được tạo thành công',
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
                include: {
                    subCategories: true,
                },
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
            include: {
                subCategories: true,
            },
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
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                subCategories: true,
            },
        });
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
            throw new common_1.NotFoundException('Không tìm thấy danh mục.');
        }
        const { parentId, ...restDto } = dto;
        const updateData = { ...restDto };
        const isTitleChanged = restDto.title !== undefined && restDto.title !== category.title;
        const isSlugManuallyChanged = restDto.slug !== undefined && restDto.slug !== category.slug;
        if (isSlugManuallyChanged) {
            updateData.slug = restDto.slug;
        }
        else if (isTitleChanged) {
            if (typeof restDto.title === 'string') {
                updateData.slug = (0, slugify_1.default)(restDto.title, { lower: true, strict: true });
            }
            else {
                console.error("Logic error: restDto.title is not a string when isTitleChanged is true.");
                throw new common_1.InternalServerErrorException("Lỗi logic nội bộ khi tạo slug.");
            }
        }
        if (updateData.slug !== undefined && updateData.slug !== category.slug) {
            const existingCategoryWithSlug = await this.prisma.category.findUnique({
                where: { slug: updateData.slug },
            });
            if (existingCategoryWithSlug && existingCategoryWithSlug.id !== id) {
                throw new common_1.BadRequestException(`Danh mục với slug '${updateData.slug}' đã tồn tại.`);
            }
        }
        if (parentId !== undefined) {
            if (parentId === id) {
                throw new common_1.BadRequestException('Một danh mục không thể là cha của chính nó.');
            }
            if (parentId !== null) {
                const parentCategory = await this.prisma.category.findUnique({ where: { id: parentId } });
                if (!parentCategory) {
                    throw new common_1.NotFoundException(`Danh mục cha với ID ${parentId} không tìm thấy.`);
                }
                const isDescendant = await this.isDescendant(id, parentId);
                if (isDescendant) {
                    throw new common_1.BadRequestException('Không thể đặt danh mục này làm cha vì nó là danh mục con của danh mục hiện tại.');
                }
                updateData.parent = { connect: { id: parentId } };
            }
            else {
                updateData.parent = { disconnect: true };
            }
        }
        if (file) {
            const currentPublicId = category.image ? (0, file_util_1.extractPublicId)(category.image) : null;
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
            message: 'Danh mục đã được cập nhật thành công',
            data: updatedCategory,
        };
    }
    async isDescendant(ancestorId, childId) {
        if (ancestorId === childId)
            return true;
        let current = await this.prisma.category.findUnique({ where: { id: childId } });
        while (current && current.parentId !== null) {
            if (current.parentId === ancestorId) {
                return true;
            }
            current = await this.prisma.category.findUnique({ where: { id: current.parentId } });
        }
        return false;
    }
    async remove(id) {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const hasChildren = await this.prisma.category.count({
            where: { parentId: id },
        });
        if (hasChildren > 0) {
            throw new common_1.BadRequestException('Cannot delete category with existing subcategories. Please delete subcategories first.');
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