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
exports.VariantService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let VariantService = class VariantService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, files) {
        let thumb = dto.thumb;
        let images = [];
        if (files?.thumb?.[0]) {
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], 0, 'variant');
            thumb = secure_url;
        }
        if (files?.images?.length) {
            const uploaded = await Promise.all(files.images.map((file) => this.uploadService.uploadImage(file, 0, 'variant')));
            images = uploaded.map((img) => img.secure_url);
        }
        if (!thumb) {
            throw new common_1.BadRequestException('Thumb is required');
        }
        let sizeIds = [];
        if (dto.sizeIds) {
            try {
                sizeIds = (typeof dto.sizeIds === 'string' ? JSON.parse(dto.sizeIds) : dto.sizeIds).map((id) => Number(id));
            }
            catch (error) {
                throw new common_1.BadRequestException('Invalid sizeIds format');
            }
        }
        else {
            sizeIds = [];
        }
        if (sizeIds.length > 0) {
            const validSizes = await this.prisma.size.findMany({
                where: { id: { in: sizeIds } },
            });
            if (validSizes.length !== sizeIds.length) {
                throw new common_1.BadRequestException('Some sizeIds are invalid');
            }
        }
        const variant = await this.prisma.variant.create({
            data: {
                title: dto.title,
                price: Number(dto.price),
                discount: dto.discount ? Number(dto.discount) : 0,
                productId: Number(dto.productId),
                colorId: dto.colorId ? Number(dto.colorId) : undefined,
                thumb,
                images,
                sku: `SKU-${dto.productId}-${Date.now()}`,
            },
        });
        if (sizeIds.length > 0) {
            await this.prisma.variantSize.createMany({
                data: sizeIds.map((sizeId) => ({
                    variantId: variant.id,
                    sizeId,
                })),
                skipDuplicates: true,
            });
        }
        const variantWithSizes = await this.prisma.variant.findUnique({
            where: { id: variant.id },
            include: {
                sizes: {
                    include: {
                        size: true,
                    },
                },
                color: true,
            },
        });
        return {
            success: true,
            message: 'Variant created successfully',
            data: variantWithSizes,
        };
    }
    async update(id, dto, files) {
        const existingVariant = await this.prisma.variant.findUnique({
            where: { id },
            include: {
                sizes: true,
            },
        });
        if (!existingVariant) {
            throw new common_1.NotFoundException('Variant not found');
        }
        const updateData = { ...dto };
        let thumbUrl = existingVariant.thumb;
        let newImagesUrls = [...existingVariant.images];
        if (files?.thumb?.[0]) {
            const oldThumbPublicId = (0, file_util_1.extractPublicId)(existingVariant.thumb);
            if (oldThumbPublicId) {
                await this.uploadService.deleteImage(oldThumbPublicId);
            }
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], id, 'variant');
            thumbUrl = secure_url;
            updateData.thumb = thumbUrl;
        }
        if (files?.images?.length) {
            const oldImagePublicIds = existingVariant.images
                .map(file_util_1.extractPublicId)
                .filter((imageId) => !!imageId);
            await Promise.all(oldImagePublicIds.map((oldId) => this.uploadService.deleteImage(oldId)));
            const uploaded = await Promise.all(files.images.map((file) => this.uploadService.uploadImage(file, id, 'variant')));
            newImagesUrls = uploaded.map((img) => img.secure_url);
            updateData.images = newImagesUrls;
        }
        else if (files?.images && files.images.length === 0) {
            const oldImagePublicIds = existingVariant.images
                .map(file_util_1.extractPublicId)
                .filter((imageId) => !!imageId);
            await Promise.all(oldImagePublicIds.map((oldId) => this.uploadService.deleteImage(oldId)));
            newImagesUrls = [];
            updateData.images = newImagesUrls;
        }
        const numericFields = ['price', 'discount', 'colorId', 'productId'].reduce((acc, field) => {
            if (dto[field] !== undefined && dto[field] !== null) {
                acc[field] = Number(dto[field]);
            }
            return acc;
        }, {});
        Object.assign(updateData, numericFields);
        delete updateData.sizeIds;
        delete updateData.sku;
        await this.prisma.variant.update({
            where: { id },
            data: updateData,
        });
        let sizeIdsToProcess = [];
        if (dto.sizeIds !== undefined) {
            try {
                sizeIdsToProcess = Array.isArray(dto.sizeIds)
                    ? dto.sizeIds.map(id => Number(id))
                    : JSON.parse(dto.sizeIds).map((id) => Number(id));
                sizeIdsToProcess = sizeIdsToProcess
                    .filter(id => !isNaN(id) && id > 0);
            }
            catch (error) {
                throw new common_1.BadRequestException('Invalid sizeIds format');
            }
            if (sizeIdsToProcess.length > 0) {
                const validSizes = await this.prisma.size.findMany({
                    where: { id: { in: sizeIdsToProcess } },
                });
                if (validSizes.length !== sizeIdsToProcess.length) {
                    throw new common_1.BadRequestException('Some sizeIds are invalid');
                }
            }
            await this.prisma.variantSize.deleteMany({ where: { variantId: id } });
            if (sizeIdsToProcess.length > 0) {
                await this.prisma.variantSize.createMany({
                    data: sizeIdsToProcess.map((sizeId) => ({
                        variantId: id,
                        sizeId,
                    })),
                    skipDuplicates: true,
                });
            }
        }
        const finalVariant = await this.prisma.variant.findUnique({
            where: { id },
            include: {
                sizes: { include: { size: true } },
                color: true,
            },
        });
        if (!finalVariant) {
            throw new common_1.InternalServerErrorException('Variant not found after update');
        }
        const formattedVariant = {
            ...finalVariant,
            sizes: finalVariant.sizes.map((item) => item.size),
        };
        delete formattedVariant.sizes;
        return {
            success: true,
            message: 'Variant updated successfully',
            data: formattedVariant,
        };
    }
    async findAll(productId, page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        if (!productId) {
            throw new common_1.BadRequestException('productId is required');
        }
        const whereClause = {
            productId,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [variants, total] = await this.prisma.$transaction([
            this.prisma.variant.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    sizes: {
                        select: {
                            size: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            }
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
            }),
            this.prisma.variant.count({ where: whereClause }),
        ]);
        const variantsWithSizes = variants.map((variant) => ({
            ...variant,
            sizes: variant.sizes.map((vs) => vs.size),
            color: variant.color,
        }));
        return {
            success: true,
            data: variantsWithSizes,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const variant = await this.prisma.variant.findUnique({
            where: { id },
            include: {
                sizes: {
                    select: {
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
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        const formatted = {
            ...variant,
            sizes: variant.sizes.map((vs) => vs.size),
        };
        return {
            success: true,
            data: [formatted],
            total: 1,
            page: 1,
            pageCount: 1,
        };
    }
    async remove(id) {
        const variant = await this.prisma.variant.findUnique({
            where: { id },
        });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        if (variant.thumb) {
            await this.uploadService.deleteImageFromUrl(variant.thumb);
        }
        if (variant.images.length) {
            for (const img of variant.images) {
                await this.uploadService.deleteImageFromUrl(img);
            }
        }
        await this.prisma.variantSize.deleteMany({
            where: { variantId: id },
        });
        await this.prisma.variant.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Variant deleted successfully',
        };
    }
    async getSizesByVariantId(variantId) {
        const variant = await this.prisma.variant.findUnique({
            where: { id: variantId },
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
            },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID ${variantId} not found`);
        }
        const sizes = variant.sizes.map((vs) => vs.size);
        return {
            success: true,
            message: `Sizes for variant ID ${variantId} fetched successfully`,
            data: sizes,
        };
    }
};
exports.VariantService = VariantService;
exports.VariantService = VariantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], VariantService);
//# sourceMappingURL=variant.service.js.map