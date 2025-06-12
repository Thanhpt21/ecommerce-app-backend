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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const slugify_1 = require("slugify");
const file_util_1 = require("../utils/file.util");
let ProductService = class ProductService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, files) {
        if (!dto.title || typeof dto.title !== 'string') {
            throw new common_1.BadRequestException('Title is required and must be a string');
        }
        const slug = (0, slugify_1.default)(dto.title, { lower: true });
        let thumb = dto.thumb;
        let images = [];
        if (files?.thumb?.[0]) {
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], 0, 'product');
            thumb = secure_url;
        }
        if (files?.images?.length) {
            const uploadedImages = await Promise.all(files.images.map((file) => this.uploadService.uploadImage(file, 0, 'product')));
            images = uploadedImages.map((img) => img.secure_url);
        }
        const tags = typeof dto.tags === 'string' ? JSON.parse(dto.tags) : dto.tags;
        const numericFields = {
            price: Number(dto.price),
            discount: dto.discount ? Number(dto.discount) : 0,
            brandId: dto.brandId ? Number(dto.brandId) : undefined,
            categoryId: dto.categoryId ? Number(dto.categoryId) : undefined,
            colorId: dto.colorId ? Number(dto.colorId) : undefined,
        };
        if (!thumb)
            throw new common_1.BadRequestException('Thumb is required');
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
        const product = await this.prisma.product.create({
            data: {
                title: dto.title,
                slug,
                description: dto.description,
                code: dto.code,
                thumb,
                images,
                status: dto.status ?? 'Còn hàng',
                tags,
                ...numericFields,
            },
        });
        if (sizeIds.length > 0) {
            await this.prisma.productSize.createMany({
                data: sizeIds.map((sizeId) => ({
                    productId: product.id,
                    sizeId,
                })),
                skipDuplicates: true,
            });
        }
        const productWithSizes = await this.prisma.product.findUnique({
            where: { id: product.id },
            include: {
                size: {
                    include: {
                        size: true,
                    },
                },
            },
        });
        return {
            success: true,
            message: 'Product created successfully',
            data: productWithSizes,
        };
    }
    async update(id, dto, files) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                size: true,
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const updateData = { ...dto };
        if (dto.tags) {
            const tagsInput = dto.tags;
            updateData.tags = Array.isArray(tagsInput)
                ? tagsInput.map(tag => tag.trim())
                : tagsInput.split(',').map(tag => tag.trim());
        }
        if (dto.slug !== undefined) {
            updateData.slug = dto.slug;
        }
        else if (dto.title) {
            updateData.slug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
        }
        let thumbUrl = product.thumb;
        let newImagesUrls = [...product.images];
        if (files?.thumb?.[0]) {
            const oldThumbId = (0, file_util_1.extractPublicId)(product.thumb);
            if (oldThumbId)
                await this.uploadService.deleteImage(oldThumbId);
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], id, 'product');
            thumbUrl = secure_url;
            updateData.thumb = thumbUrl;
        }
        if (files?.images?.length) {
            const oldImageIds = product.images
                .map(file_util_1.extractPublicId)
                .filter((imageId) => !!imageId);
            await Promise.all(oldImageIds.map((oldId) => this.uploadService.deleteImage(oldId)));
            const uploaded = await Promise.all(files.images.map((file) => this.uploadService.uploadImage(file, id, 'product')));
            newImagesUrls = uploaded.map((file) => file.secure_url);
            updateData.images = newImagesUrls;
        }
        const numericFields = ['price', 'discount', 'brandId', 'categoryId', 'colorId'].reduce((acc, field) => {
            if (dto[field] !== undefined)
                acc[field] = Number(dto[field]);
            return acc;
        }, {});
        Object.assign(updateData, numericFields);
        delete updateData.sizeIds;
        const updatePayload = { ...updateData };
        if (files?.thumb?.[0])
            updatePayload.thumb = thumbUrl;
        if (files?.images?.length)
            updatePayload.images = newImagesUrls;
        await this.prisma.product.update({
            where: { id },
            data: updatePayload,
        });
        let sizeIdsToProcess = [];
        if (dto.sizeIds) {
            try {
                sizeIdsToProcess = Array.isArray(dto.sizeIds)
                    ? dto.sizeIds
                    : JSON.parse(dto.sizeIds);
                sizeIdsToProcess = sizeIdsToProcess
                    .map(id => Number(id))
                    .filter(id => !isNaN(id) && id > 0);
            }
            catch (error) {
                throw new common_1.BadRequestException('Invalid sizeIds format');
            }
        }
        await this.prisma.productSize.deleteMany({
            where: { productId: id },
        });
        if (sizeIdsToProcess.length > 0) {
            await this.prisma.productSize.createMany({
                data: sizeIdsToProcess.map((sizeId) => ({
                    productId: id,
                    sizeId,
                })),
                skipDuplicates: true,
            });
        }
        const finalProduct = await this.prisma.product.findUnique({
            where: { id },
            include: {
                size: { include: { size: true } },
            },
        });
        if (!finalProduct) {
            throw new common_1.InternalServerErrorException('Product not found after update');
        }
        const formattedProduct = {
            ...finalProduct,
            sizes: finalProduct.size.map((item) => item.size),
        };
        delete formattedProduct.size;
        return {
            success: true,
            message: 'Product updated successfully',
            data: formattedProduct,
        };
    }
    async findAll(page = 1, limit = 10, search = '', categoryId, brandId, colorId, sortBy, price_gte, price_lte) {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        if (categoryId) {
            whereClause.categoryId = Number(categoryId);
        }
        if (brandId) {
            whereClause.brandId = Number(brandId);
        }
        if (colorId) {
            whereClause.colorId = Number(colorId);
        }
        if (price_gte !== undefined || price_lte !== undefined) {
            whereClause.price = {
                ...(price_gte !== undefined && { gte: price_gte }),
                ...(price_lte !== undefined && { lte: price_lte }),
            };
        }
        let orderByClause = { createdAt: 'desc' };
        switch (sortBy) {
            case 'price_asc':
                orderByClause = { price: 'asc' };
                break;
            case 'price_desc':
                orderByClause = { price: 'desc' };
                break;
            case 'created_at_asc':
                orderByClause = { createdAt: 'asc' };
                break;
            case 'created_at_desc':
                orderByClause = { createdAt: 'desc' };
                break;
            case 'averageRating_desc':
                orderByClause = { averageRating: 'desc' };
                break;
            default:
                orderByClause = { createdAt: 'desc' };
                break;
        }
        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: orderByClause,
                include: {
                    ratings: {
                        include: {
                            postedBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    profilePicture: true,
                                },
                            },
                        },
                    },
                    size: {
                        include: {
                            size: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    brand: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    color: {
                        select: {
                            id: true,
                            title: true,
                            code: true,
                        },
                    },
                    variants: {
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
                            color: {
                                select: {
                                    id: true,
                                    title: true,
                                    code: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.product.count({ where: whereClause }),
        ]);
        const result = products.map(({ size, variants, ...rest }) => ({
            ...rest,
            sizes: size.map((s) => s.size),
            variants: variants.map((variant) => ({
                ...variant,
                sizes: variant.sizes.map((s) => s.size),
            })),
        }));
        return {
            success: true,
            message: total > 0 ? 'Products found successfully' : 'No products found',
            data: result,
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
        const products = await this.prisma.product.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            include: {
                ratings: {
                    include: {
                        postedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
                size: {
                    include: {
                        size: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                brand: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                color: {
                    select: {
                        id: true,
                        title: true,
                        code: true,
                    },
                },
                variants: {
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
                        color: {
                            select: {
                                id: true,
                                title: true,
                                code: true,
                            },
                        },
                    },
                },
            },
        });
        const result = products.map(({ size, variants, ...rest }) => ({
            ...rest,
            sizes: size.map((s) => s.size),
            variants: variants.map((variant) => ({
                ...variant,
                sizes: variant.sizes.map((s) => s.size),
            })),
        }));
        return {
            success: true,
            message: result.length > 0 ? 'Products found successfully' : 'No products found',
            data: result,
        };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                brand: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                color: {
                    select: {
                        id: true,
                        title: true,
                        code: true,
                    },
                },
                size: {
                    include: {
                        size: {
                            select: {
                                id: true,
                                title: true,
                            },
                        },
                    },
                },
                ratings: {
                    include: {
                        postedBy: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profilePicture: true,
                            },
                        },
                    },
                },
                variants: {
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
                        color: {
                            select: {
                                id: true,
                                title: true,
                                code: true,
                            },
                        },
                    },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        const { size, variants, brandId, categoryId, colorId, ...rest } = product;
        return {
            success: true,
            message: `Product with ID fetched successfully`,
            data: {
                ...rest,
                sizes: size.map((s) => s.size),
                variants: variants.map((variant) => ({
                    ...variant,
                    sizes: variant.sizes.map((s) => s.size),
                })),
            },
        };
    }
    async findBySlug(slug) {
        try {
            const product = await this.prisma.product.findUnique({
                where: { slug },
                include: {
                    brand: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    color: {
                        select: {
                            id: true,
                            title: true,
                            code: true,
                        },
                    },
                    size: {
                        include: {
                            size: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    ratings: {
                        include: {
                            postedBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    profilePicture: true,
                                },
                            },
                        },
                    },
                    variants: {
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
                            color: {
                                select: {
                                    id: true,
                                    title: true,
                                    code: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!product) {
                throw new common_1.NotFoundException('Product not found');
            }
            const { size, variants, brandId, categoryId, colorId, ...rest } = product;
            const formattedProduct = {
                ...rest,
                sizes: size.map((s) => s.size),
                variants: variants.map((variant) => ({
                    ...variant,
                    sizes: variant.sizes.map((s) => s.size),
                })),
            };
            return {
                success: true,
                message: 'Product found successfully',
                data: formattedProduct,
            };
        }
        catch (error) {
            console.error('Error finding product by slug:', error);
            if (error instanceof common_1.NotFoundException) {
                return {
                    success: false,
                    message: error.message,
                    data: null,
                };
            }
            return {
                success: false,
                message: 'Failed to find product',
                data: null,
            };
        }
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const thumbId = (0, file_util_1.extractPublicId)(product.thumb);
        if (thumbId) {
            await this.uploadService.deleteImage(thumbId);
        }
        if (product.images?.length) {
            const imageIds = product.images
                .map(file_util_1.extractPublicId)
                .filter((id) => id !== null);
            await Promise.all(imageIds.map((id) => this.uploadService.deleteImage(id)));
        }
        await this.prisma.productSize.deleteMany({
            where: { productId: id },
        });
        await this.prisma.product.delete({ where: { id } });
        return {
            success: true,
            message: 'Product removed successfully',
        };
    }
    async getSizesByProductId(productId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                size: {
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
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        const sizes = product.size.map((ps) => ps.size);
        return {
            success: true,
            message: `Sizes for product ID ${productId} fetched successfully`,
            data: sizes,
        };
    }
    async findProductsByCategorySlug(categorySlug, page = 1, limit = 10, search = '', sortBy, brandId, colorId) {
        const category = await this.prisma.category.findUnique({
            where: { slug: categorySlug },
            select: { id: true, title: true, slug: true },
        });
        if (!category) {
            return {
                success: true,
                message: 'Category not found, no products to display',
                data: [],
                total: 0,
                page,
                pageCount: 0,
                categoryInfo: null,
            };
        }
        const categoryId = category.id;
        const skip = (page - 1) * limit;
        const whereClause = {
            categoryId: categoryId,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { slug: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        if (brandId) {
            whereClause.brandId = Number(brandId);
        }
        if (colorId) {
            whereClause.colorId = Number(colorId);
        }
        let orderByClause = { createdAt: 'desc' };
        switch (sortBy) {
            case 'price_asc':
                orderByClause = { price: 'asc' };
                break;
            case 'price_desc':
                orderByClause = { price: 'desc' };
                break;
            case 'created_at_asc':
                orderByClause = { createdAt: 'asc' };
                break;
            case 'created_at_desc':
                orderByClause = { createdAt: 'desc' };
                break;
            case 'sold_desc':
                orderByClause = { sold: 'desc' };
                break;
            case 'averageRating_desc':
                orderByClause = { averageRating: 'desc' };
                break;
            default:
                orderByClause = { createdAt: 'desc' };
                break;
        }
        const [products, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: orderByClause,
                include: {
                    ratings: {
                        include: {
                            postedBy: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    profilePicture: true,
                                },
                            },
                        },
                    },
                    size: {
                        include: {
                            size: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    brand: {
                        select: {
                            id: true,
                            title: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    color: {
                        select: {
                            id: true,
                            title: true,
                            code: true,
                        },
                    },
                    variants: {
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
                            color: {
                                select: {
                                    id: true,
                                    title: true,
                                    code: true,
                                },
                            },
                        },
                    },
                },
            }),
            this.prisma.product.count({ where: whereClause }),
        ]);
        const result = products.map(({ size, variants, ...rest }) => ({
            ...rest,
            sizes: size.map((s) => s.size),
            variants: variants.map((variant) => ({
                ...variant,
                sizes: variant.sizes.map((s) => s.size),
            })),
        }));
        return {
            success: true,
            message: total > 0 ? 'Products found successfully' : 'No products found',
            data: result,
            total,
            page,
            pageCount: Math.ceil(total / limit),
            categoryInfo: category,
        };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], ProductService);
//# sourceMappingURL=product.service.js.map