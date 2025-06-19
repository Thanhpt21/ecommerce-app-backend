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
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const slugify_1 = require("slugify");
const file_util_1 = require("../utils/file.util");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ProductService = ProductService_1 = class ProductService {
    prisma;
    uploadService;
    logger = new common_1.Logger(ProductService_1.name);
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, files) {
        if (!dto.title || typeof dto.title !== 'string') {
            throw new common_1.BadRequestException('Tiêu đề sản phẩm là bắt buộc và phải là chuỗi.');
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
            weight: dto.weight ? Number(dto.weight) : undefined,
        };
        if (!thumb)
            throw new common_1.BadRequestException('Ảnh thumbnail là bắt buộc.');
        let parsedProductSizes = [];
        if (dto.productSizes) {
            try {
                const rawProductSizes = JSON.parse(dto.productSizes);
                if (!Array.isArray(rawProductSizes)) {
                    throw new common_1.BadRequestException('Dữ liệu productSizes phải là một mảng.');
                }
                const validationErrors = [];
                for (const item of rawProductSizes) {
                    const instance = (0, class_transformer_1.plainToInstance)(create_product_dto_1.ProductSizeDto, item);
                    const errors = await (0, class_validator_1.validate)(instance);
                    if (errors.length > 0) {
                        validationErrors.push(...errors);
                    }
                    else {
                        parsedProductSizes.push(instance);
                    }
                }
                if (validationErrors.length > 0) {
                    this.logger.error('ProductSizes Validation Errors:', validationErrors);
                    const errorMessages = validationErrors.map(err => Object.values(err.constraints || {})).flat();
                    throw new common_1.BadRequestException(`Lỗi validation productSizes: ${errorMessages.join(', ')}`);
                }
            }
            catch (parseError) {
                this.logger.error('Lỗi parse productSizes:', parseError);
                throw new common_1.BadRequestException('Dữ liệu productSizes không hợp lệ (không phải JSON hoặc sai cấu trúc).');
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
                weightUnit: dto.weightUnit,
                unit: dto.unit ?? 'cái',
            },
        });
        if (parsedProductSizes.length > 0) {
            await this.prisma.productSize.createMany({
                data: parsedProductSizes.map((ps) => ({
                    productId: product.id,
                    sizeId: ps.sizeId,
                    quantity: ps.quantity ?? 0,
                })),
                skipDuplicates: true,
            });
        }
        const productWithDetails = await this.prisma.product.findUnique({
            where: { id: product.id },
            include: {
                size: {
                    include: {
                        size: true,
                    },
                },
                brand: true,
                category: true,
                color: true,
            },
        });
        return {
            success: true,
            message: 'Sản phẩm đã được tạo thành công.',
            data: productWithDetails,
        };
    }
    async update(id, dto, files) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                size: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException(`Không tìm thấy sản phẩm với ID ${id}.`);
        }
        const updateData = {};
        if (dto.description !== undefined)
            updateData.description = dto.description;
        if (dto.code !== undefined)
            updateData.code = dto.code;
        if (dto.status !== undefined)
            updateData.status = dto.status;
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.price !== undefined)
            updateData.price = dto.price;
        if (dto.discount !== undefined)
            updateData.discount = dto.discount;
        if (dto.brandId !== undefined) {
            updateData.brand = dto.brandId === null ? { disconnect: true } : { connect: { id: dto.brandId } };
        }
        if (dto.categoryId !== undefined) {
            updateData.category = dto.categoryId === null ? { disconnect: true } : { connect: { id: dto.categoryId } };
        }
        if (dto.colorId !== undefined) {
            updateData.color = dto.colorId === null ? { disconnect: true } : { connect: { id: dto.colorId } };
        }
        if (dto.weight !== undefined)
            updateData.weight = dto.weight;
        if (dto.weightUnit !== undefined)
            updateData.weightUnit = dto.weightUnit;
        if (dto.unit !== undefined)
            updateData.unit = dto.unit;
        const isTitleChanged = dto.title !== undefined && dto.title !== product.title;
        const isSlugManuallyChanged = dto.slug !== undefined && dto.slug !== product.slug;
        let newSlug;
        if (isSlugManuallyChanged) {
            newSlug = dto.slug;
        }
        else if (isTitleChanged) {
            if (typeof dto.title === 'string') {
                newSlug = (0, slugify_1.default)(dto.title, { lower: true, strict: true });
            }
            else {
                console.error('Lỗi logic: dto.title không phải chuỗi khi isTitleChanged là true.');
                throw new common_1.InternalServerErrorException('Lỗi nội bộ khi tạo slug cho sản phẩm.');
            }
        }
        if (newSlug !== undefined && newSlug !== product.slug) {
            const existingProductWithSlug = await this.prisma.product.findUnique({
                where: { slug: newSlug },
            });
            if (existingProductWithSlug && existingProductWithSlug.id !== product.id) {
                throw new common_1.BadRequestException(`Sản phẩm với slug '${newSlug}' đã tồn tại.`);
            }
            updateData.slug = newSlug;
        }
        else if (dto.slug !== undefined && dto.slug === product.slug) {
            updateData.slug = dto.slug;
        }
        if (dto.tags !== undefined) {
            updateData.tags = dto.tags;
        }
        if (files?.thumb?.[0]) {
            if (product.thumb) {
                const oldThumbPublicId = (0, file_util_1.extractPublicId)(product.thumb);
                if (oldThumbPublicId) {
                    await this.uploadService.deleteImage(oldThumbPublicId);
                }
            }
            const { secure_url } = await this.uploadService.uploadImage(files.thumb[0], id, 'product');
            updateData.thumb = secure_url;
        }
        if (files?.images?.length) {
            if (product.images && product.images.length > 0) {
                const oldImagePublicIds = product.images
                    .map(file_util_1.extractPublicId)
                    .filter((_id) => !!_id);
                await Promise.all(oldImagePublicIds.map((publicId) => this.uploadService.deleteImage(publicId)));
            }
            const uploadedImages = await Promise.all(files.images.map((file) => this.uploadService.uploadImage(file, id, 'product')));
            updateData.images = uploadedImages.map((img) => img.secure_url);
        }
        else if (dto.images !== undefined) {
            if (dto.images !== null && dto.images.length === 0) {
                if (product.images && product.images.length > 0) {
                    const oldImagePublicIds = product.images
                        .map(file_util_1.extractPublicId)
                        .filter((_id) => !!_id);
                    await Promise.all(oldImagePublicIds.map((publicId) => this.uploadService.deleteImage(publicId)));
                }
                updateData.images = [];
            }
        }
        await this.prisma.product.update({
            where: { id },
            data: updateData,
        });
        if (dto.productSizes !== undefined) {
            const productSizesData = dto.productSizes;
            const sizeIdsFromDto = productSizesData.map(item => item.sizeId);
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
                await prisma.productSize.deleteMany({
                    where: { productId: id },
                });
                if (productSizesData.length > 0) {
                    await prisma.productSize.createMany({
                        data: productSizesData.map((item) => ({
                            productId: id,
                            sizeId: item.sizeId,
                            quantity: item.quantity,
                        })),
                        skipDuplicates: true,
                    });
                }
            });
        }
        const finalProduct = await this.prisma.product.findUnique({
            where: { id },
            include: {
                size: { include: { size: true } },
                brand: true,
                category: true,
                color: true,
            },
        });
        if (!finalProduct) {
            throw new common_1.InternalServerErrorException('Không tìm thấy sản phẩm sau thao tác cập nhật.');
        }
        const formattedProduct = {
            ...finalProduct,
            sizes: finalProduct.size.map((item) => ({
                id: item.size.id,
                title: item.size.title,
                quantity: item.quantity,
                createdAt: item.size.createdAt,
                updatedAt: item.size.updatedAt,
            })),
        };
        delete formattedProduct.size;
        return {
            success: true,
            message: 'Cập nhật sản phẩm thành công.',
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
                        select: {
                            quantity: true,
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
                                select: {
                                    quantity: true,
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
            sizes: size.map((s) => ({
                id: s.size.id,
                title: s.size.title,
                quantity: s.quantity,
            })),
            variants: variants.map((variant) => ({
                ...variant,
                sizes: variant.sizes.map((s) => ({
                    id: s.size.id,
                    title: s.size.title,
                    quantity: s.quantity,
                })),
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
                sizes: size.map((s) => ({
                    id: s.size.id,
                    title: s.size.title,
                    quantity: s.quantity,
                })),
                variants: variants.map((variant) => ({
                    ...variant,
                    sizes: variant.sizes.map((s) => ({
                        id: s.size.id,
                        title: s.size.title,
                        quantity: s.quantity,
                    })),
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
                    select: {
                        quantity: true,
                        sizeId: true,
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
        const sizesWithQuantity = product.size.map((ps) => ({
            productId: product.id,
            sizeId: ps.size.id,
            title: ps.size.title,
            quantity: ps.quantity,
        }));
        return {
            success: true,
            message: `Sizes for product ID ${productId} fetched successfully`,
            data: sizesWithQuantity,
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
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], ProductService);
//# sourceMappingURL=product.service.js.map