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
exports.StoreService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let StoreService = class StoreService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, file) {
        let image = dto.image;
        if (file) {
            const { secure_url } = await this.uploadService.uploadImage(file, 0, 'store');
            image = secure_url;
        }
        const store = await this.prisma.store.create({
            data: { ...dto, image: image },
        });
        return {
            success: true,
            message: 'Store created successfully',
            data: store,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const where = search
            ? { name: { contains: search, mode: 'insensitive' } }
            : {};
        const [stores, total] = await this.prisma.$transaction([
            this.prisma.store.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.store.count({ where }),
        ]);
        return {
            success: true,
            message: 'Store list retrieved successfully',
            data: stores,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const store = await this.prisma.store.findUnique({ where: { id } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        return {
            success: true,
            message: 'Store retrieved successfully',
            data: store,
        };
    }
    async update(id, dto, file) {
        const store = await this.prisma.store.findUnique({ where: { id } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        const updateData = { ...dto };
        if (file) {
            const oldPublicId = (0, file_util_1.extractPublicId)(store.image);
            if (oldPublicId) {
                await this.uploadService.deleteImage(oldPublicId);
            }
            const { secure_url } = await this.uploadService.uploadImage(file, id, 'store');
            updateData.image = secure_url;
        }
        const updated = await this.prisma.store.update({
            where: { id },
            data: updateData,
        });
        return {
            success: true,
            message: 'Store updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        const store = await this.prisma.store.findUnique({ where: { id } });
        if (!store)
            throw new common_1.NotFoundException('Store not found');
        const publicId = (0, file_util_1.extractPublicId)(store.image);
        if (publicId) {
            await this.uploadService.deleteImage(publicId);
        }
        await this.prisma.store.delete({ where: { id } });
        return {
            success: true,
            message: 'Store removed successfully',
        };
    }
};
exports.StoreService = StoreService;
exports.StoreService = StoreService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], StoreService);
//# sourceMappingURL=store.service.js.map