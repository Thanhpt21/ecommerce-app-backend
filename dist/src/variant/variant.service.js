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
const create_variant_dto_1 = require("./dto/create-variant.dto");
const file_util_1 = require("../utils/file.util");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
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
        let parsedVariantSizes = [];
        if (dto.variantSizes) {
            try {
                const rawVariantSizes = JSON.parse(dto.variantSizes);
                if (!Array.isArray(rawVariantSizes)) {
                    throw new common_1.BadRequestException('Dữ liệu variantSizes phải là một mảng.');
                }
                const validationErrors = [];
                for (const item of rawVariantSizes) {
                    const instance = (0, class_transformer_1.plainToInstance)(create_variant_dto_1.VariantSizeDto, item);
                    const errors = await (0, class_validator_1.validate)(instance);
                    if (errors.length > 0) {
                        validationErrors.push(...errors);
                    }
                    else {
                        parsedVariantSizes.push(instance);
                    }
                }
                if (validationErrors.length > 0) {
                    const errorMessages = validationErrors.map(err => {
                        return err.constraints ? Object.values(err.constraints).join(', ') : 'Lỗi không xác định.';
                    }).flat();
                    throw new common_1.BadRequestException(`Lỗi validation variantSizes: ${errorMessages.join('; ')}`);
                }
            }
            catch (parseError) {
                throw new common_1.BadRequestException('Dữ liệu variantSizes không hợp lệ (không phải JSON hoặc sai cấu trúc).');
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
                sku: `SKU-${dto.productId}`,
            },
        });
        if (parsedVariantSizes.length > 0) {
            await this.prisma.variantSize.createMany({
                data: parsedVariantSizes.map((vs) => ({
                    variantId: variant.id,
                    sizeId: vs.sizeId,
                    quantity: vs.quantity ?? 0,
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
            throw new common_1.NotFoundException(`Không tìm thấy biến thể với ID ${id}.`);
        }
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.price !== undefined)
            updateData.price = dto.price;
        if (dto.discount !== undefined)
            updateData.discount = dto.discount;
        if (dto.colorId !== undefined) {
            updateData.color = dto.colorId === null ? { disconnect: true } : { connect: { id: dto.colorId } };
        }
        if (files?.thumb?.[0]) {
            if (existingVariant.thumb) {
                const oldThumbPublicId = (0, file_util_1.extractPublicId)(existingVariant.thumb);
                if (oldThumbPublicId) {
                    await this.uploadService.deleteImage(oldThumbPublicId);
                }
            }
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], id, 'variant');
            updateData.thumb = secure_url;
        }
        if (files?.images?.length) {
            if (existingVariant.images && existingVariant.images.length > 0) {
                const oldImagePublicIds = existingVariant.images
                    .map(file_util_1.extractPublicId)
                    .filter((_id) => !!_id);
                await Promise.all(oldImagePublicIds.map((publicId) => this.uploadService.deleteImage(publicId)));
            }
            const uploadedImages = await Promise.all(files.images.map((file) => this.uploadService.uploadImage(file, id, 'variant')));
            updateData.images = uploadedImages.map((img) => img.secure_url);
        }
        else if (dto.images !== undefined) {
            if (dto.images !== null && dto.images.length === 0) {
                if (existingVariant.images && existingVariant.images.length > 0) {
                    const oldImagePublicIds = existingVariant.images
                        .map(file_util_1.extractPublicId)
                        .filter((_id) => !!_id);
                    await Promise.all(oldImagePublicIds.map((publicId) => this.uploadService.deleteImage(publicId)));
                }
                updateData.images = [];
            }
        }
        await this.prisma.variant.update({
            where: { id },
            data: updateData,
        });
        if (dto.variantSizes !== undefined) {
            const variantSizesData = dto.variantSizes;
            const sizeIdsFromDto = variantSizesData.map(item => item.sizeId);
            if (sizeIdsFromDto.length > 0) {
                const validSizes = await this.prisma.size.findMany({
                    where: { id: { in: sizeIdsFromDto } },
                });
                if (validSizes.length !== sizeIdsFromDto.length) {
                    const invalidSizeIds = sizeIdsFromDto.filter((sizeId) => !validSizes.some((s) => s.id === sizeId));
                    throw new common_1.BadRequestException(`Một hoặc nhiều ID kích thước không hợp lệ: ${invalidSizeIds.join(', ')}.`);
                }
            }
            await this.prisma.$transaction(async (prisma) => {
                await prisma.variantSize.deleteMany({
                    where: { variantId: id },
                });
                if (variantSizesData.length > 0) {
                    await prisma.variantSize.createMany({
                        data: variantSizesData.map((item) => ({
                            variantId: id,
                            sizeId: item.sizeId,
                            quantity: item.quantity,
                        })),
                        skipDuplicates: true,
                    });
                }
            });
        }
        const finalVariant = await this.prisma.variant.findUnique({
            where: { id },
            include: {
                sizes: { include: { size: true } },
                color: true,
            },
        });
        if (!finalVariant) {
            throw new common_1.InternalServerErrorException('Không tìm thấy biến thể sau thao tác cập nhật.');
        }
        const formattedVariant = {
            ...finalVariant,
            sizes: finalVariant.sizes.map((item) => ({
                id: item.size.id,
                title: item.size.title,
                quantity: item.quantity,
                createdAt: item.size.createdAt,
                updatedAt: item.size.updatedAt,
            })),
        };
        delete formattedVariant.sizes;
        return {
            success: true,
            message: 'Cập nhật biến thể thành công.',
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
                            quantity: true,
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
            sizes: variant.sizes.map((vs) => ({
                id: vs.size.id,
                title: vs.size.title,
                quantity: vs.quantity,
            })),
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
                    select: {
                        sizeId: true,
                        quantity: true,
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
        const variantSizesWithDetails = variant.sizes.map((vs) => ({
            variantId: variant.id,
            sizeId: vs.size.id,
            title: vs.size.title,
            quantity: vs.quantity,
        }));
        return {
            success: true,
            message: `Sizes for variant ID ${variantId} fetched successfully`,
            data: variantSizesWithDetails,
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