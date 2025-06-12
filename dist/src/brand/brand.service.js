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
exports.BrandService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let BrandService = class BrandService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, file) {
        let image = dto.image;
        if (file) {
            const { secure_url } = await this.uploadService.uploadImage(file, 0, 'brand');
            image = secure_url;
        }
        const newBrand = await this.prisma.brand.create({ data: { ...dto, image } });
        return {
            success: true,
            message: 'Brand created successfully',
            data: newBrand,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? { title: { contains: search, mode: 'insensitive' } }
            : {};
        const [brands, total] = await this.prisma.$transaction([
            this.prisma.brand.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.brand.count({ where: whereClause }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Brands found successfully' : 'No brands found',
            data: brands,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findAllWithoutPagination(search = '') {
        const whereClause = search
            ? { title: { contains: search, mode: 'insensitive' } }
            : {};
        const brands = await this.prisma.brand.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: brands.length > 0 ? 'Brands found successfully' : 'No brands found',
            data: brands,
            total: brands.length,
        };
    }
    async findOne(id) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        return {
            success: true,
            message: 'Brand found successfully',
            data: brand,
        };
    }
    async update(id, dto, file) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        const updateData = { ...dto };
        if (file) {
            const currentPublicId = (0, file_util_1.extractPublicId)(brand.image);
            if (currentPublicId) {
                await this.uploadService.deleteImage(currentPublicId);
            }
            const { secure_url } = await this.uploadService.uploadImage(file, id, 'brand');
            updateData.image = secure_url;
        }
        const updatedBrand = await this.prisma.brand.update({
            where: { id },
            data: updateData,
        });
        return {
            success: true,
            message: 'Brand updated successfully',
            data: updatedBrand,
        };
    }
    async remove(id) {
        const brand = await this.prisma.brand.findUnique({ where: { id } });
        if (!brand)
            throw new common_1.NotFoundException('Brand not found');
        const publicId = (0, file_util_1.extractPublicId)(brand.image);
        if (publicId) {
            await this.uploadService.deleteImage(publicId);
        }
        await this.prisma.brand.delete({ where: { id } });
        return {
            success: true,
            message: 'Brand removed successfully',
        };
    }
};
exports.BrandService = BrandService;
exports.BrandService = BrandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, upload_service_1.UploadService])
], BrandService);
//# sourceMappingURL=brand.service.js.map