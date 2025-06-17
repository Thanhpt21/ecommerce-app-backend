import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductService {
    private readonly prisma;
    private readonly uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateProductDto, files: {
        thumb?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: ({
            size: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                };
            } & {
                productId: number;
                sizeId: number;
                quantity: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
        }) | null;
    }>;
    update(id: number, dto: UpdateProductDto, files: {
        thumb?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
            }[];
            size: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                };
            } & {
                productId: number;
                sizeId: number;
                quantity: number;
            })[];
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: number, brandId?: number, colorId?: number, sortBy?: string, price_gte?: number, price_lte?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
            }[];
            variants: {
                sizes: {
                    id: number;
                    title: string;
                }[];
                color: {
                    id: number;
                    title: string;
                    code: string;
                } | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                discount: number;
                thumb: string;
                price: number;
                images: string[];
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            category: {
                id: number;
                title: string;
            } | null;
            brand: {
                id: number;
                title: string;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
            } | null;
            ratings: ({
                postedBy: {
                    id: number;
                    name: string;
                    email: string;
                    profilePicture: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                productId: number;
                star: number;
                comment: string;
                postedById: number;
            })[];
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findAllWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
            }[];
            variants: {
                sizes: {
                    id: number;
                    title: string;
                }[];
                color: {
                    id: number;
                    title: string;
                    code: string;
                } | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                discount: number;
                thumb: string;
                price: number;
                images: string[];
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            category: {
                id: number;
                title: string;
            } | null;
            brand: {
                id: number;
                title: string;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
            } | null;
            ratings: ({
                postedBy: {
                    id: number;
                    name: string;
                    email: string;
                    profilePicture: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                productId: number;
                star: number;
                comment: string;
                postedById: number;
            })[];
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
        }[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
            }[];
            variants: {
                sizes: {
                    id: number;
                    title: string;
                }[];
                color: {
                    id: number;
                    title: string;
                    code: string;
                } | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                discount: number;
                thumb: string;
                price: number;
                images: string[];
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            category: {
                id: number;
                title: string;
            } | null;
            brand: {
                id: number;
                title: string;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
            } | null;
            ratings: ({
                postedBy: {
                    id: number;
                    name: string;
                    email: string;
                    profilePicture: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                productId: number;
                star: number;
                comment: string;
                postedById: number;
            })[];
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            weight: number;
            weightUnit: string;
            unit: string;
        };
    }>;
    findBySlug(slug: string): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
            }[];
            variants: {
                sizes: {
                    id: number;
                    title: string;
                }[];
                color: {
                    id: number;
                    title: string;
                    code: string;
                } | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                discount: number;
                thumb: string;
                price: number;
                images: string[];
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            category: {
                id: number;
                title: string;
            } | null;
            brand: {
                id: number;
                title: string;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
            } | null;
            ratings: ({
                postedBy: {
                    id: number;
                    name: string;
                    email: string;
                    profilePicture: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                productId: number;
                star: number;
                comment: string;
                postedById: number;
            })[];
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            weight: number;
            weightUnit: string;
            unit: string;
        };
    } | {
        success: boolean;
        message: string;
        data: null;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getSizesByProductId(productId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
        }[];
    }>;
    findProductsByCategorySlug(categorySlug: string, page?: number, limit?: number, search?: string, sortBy?: string, brandId?: number, colorId?: number): Promise<{
        success: boolean;
        message: string;
        data: never[];
        total: number;
        page: number;
        pageCount: number;
        categoryInfo: null;
    } | {
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
            }[];
            variants: {
                sizes: {
                    id: number;
                    title: string;
                }[];
                color: {
                    id: number;
                    title: string;
                    code: string;
                } | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                discount: number;
                thumb: string;
                price: number;
                images: string[];
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            category: {
                id: number;
                title: string;
                slug: string;
            } | null;
            brand: {
                id: number;
                title: string;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
            } | null;
            ratings: ({
                postedBy: {
                    id: number;
                    name: string;
                    email: string;
                    profilePicture: string | null;
                };
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                productId: number;
                star: number;
                comment: string;
                postedById: number;
            })[];
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            thumb: string;
            price: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
        categoryInfo: {
            id: number;
            title: string;
            slug: string;
        };
    }>;
}
