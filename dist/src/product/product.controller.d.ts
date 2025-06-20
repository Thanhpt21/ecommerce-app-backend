import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(dto: CreateProductDto, files: {
        thumb?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: ({
            category: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                slug: string;
                parentId: number | null;
            } | null;
            brand: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
            } | null;
            size: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                };
            } & {
                sizeId: number;
                quantity: number;
                productId: number;
            })[];
            color: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                code: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            price: number;
            status: string;
            tags: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
        }) | null;
    }>;
    update(id: string, dto: UpdateProductDto, files: {
        thumb?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
                quantity: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
            category: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                slug: string;
                parentId: number | null;
            } | null;
            brand: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
            } | null;
            size: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                };
            } & {
                sizeId: number;
                quantity: number;
                productId: number;
            })[];
            color: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                code: string;
            } | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            code: string;
            discount: number;
            description: string;
            price: number;
            status: string;
            tags: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: string, brandId?: string, colorId?: string, sortBy?: string, price_gte?: string, price_lte?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: number;
                title: string;
                quantity: number;
            }[];
            variants: {
                sizes: {
                    id: number;
                    title: string;
                    quantity: number;
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
                price: number;
                colorId: number | null;
                thumb: string;
                images: string[];
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
                    name: string;
                    email: string;
                    profilePicture: string | null;
                    id: number;
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
            price: number;
            status: string;
            tags: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getAllProductsWithoutPagination(search?: string): Promise<{
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
                price: number;
                colorId: number | null;
                thumb: string;
                images: string[];
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
                    name: string;
                    email: string;
                    profilePicture: string | null;
                    id: number;
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
            price: number;
            status: string;
            tags: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
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
                price: number;
                colorId: number | null;
                thumb: string;
                images: string[];
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
                    name: string;
                    email: string;
                    profilePicture: string | null;
                    id: number;
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
            price: number;
            status: string;
            tags: string[];
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
        };
    }>;
    findOneBySlug(slug: string): Promise<{
        success: boolean;
        message: string;
        data: {
            sizes: {
                id: any;
                title: any;
                quantity: any;
            }[];
            variants: {
                sizes: {
                    id: any;
                    title: any;
                    quantity: any;
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
                price: number;
                colorId: number | null;
                thumb: string;
                images: string[];
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
                    name: string;
                    email: string;
                    profilePicture: string | null;
                    id: number;
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
            price: number;
            status: string;
            tags: string[];
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
        };
    } | {
        success: boolean;
        message: string;
        data: null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getProductSizes(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../types/product.type").ProductSizeDetail[];
    }>;
    getProductsByCategorySlug(categorySlug: string, page?: string, limit?: string, search?: string, sortBy?: string, brandId?: string, colorId?: string): Promise<{
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
                price: number;
                colorId: number | null;
                thumb: string;
                images: string[];
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
                    name: string;
                    email: string;
                    profilePicture: string | null;
                    id: number;
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
            price: number;
            status: string;
            tags: string[];
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            thumb: string;
            weight: number;
            weightUnit: string;
            unit: string;
            images: string[];
            sold: number;
            averageRating: number;
            ratingCount: number;
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
