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
            brand: {
                id: number;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
            } | null;
            category: {
                id: number;
                title: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                parentId: number | null;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            size: ({
                size: {
                    id: number;
                    title: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                productId: number;
                sizeId: number;
                quantity: number;
            })[];
        } & {
            id: number;
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
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
            brand: {
                id: number;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
            } | null;
            category: {
                id: number;
                title: string;
                slug: string;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                parentId: number | null;
            } | null;
            color: {
                id: number;
                title: string;
                code: string;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            size: ({
                size: {
                    id: number;
                    title: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                productId: number;
                sizeId: number;
                quantity: number;
            })[];
            id: number;
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            brandId: number | null;
            categoryId: number | null;
            colorId: number | null;
            weight: number;
            weightUnit: string;
            unit: string;
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
                title: string;
                thumb: string;
                price: number;
                discount: number;
                images: string[];
                createdAt: Date;
                updatedAt: Date;
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            brand: {
                id: number;
                title: string;
            } | null;
            category: {
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
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
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
                title: string;
                thumb: string;
                price: number;
                discount: number;
                images: string[];
                createdAt: Date;
                updatedAt: Date;
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            brand: {
                id: number;
                title: string;
            } | null;
            category: {
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
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
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
                title: string;
                thumb: string;
                price: number;
                discount: number;
                images: string[];
                createdAt: Date;
                updatedAt: Date;
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            brand: {
                id: number;
                title: string;
            } | null;
            category: {
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
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            weight: number;
            weightUnit: string;
            unit: string;
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
                title: string;
                thumb: string;
                price: number;
                discount: number;
                images: string[];
                createdAt: Date;
                updatedAt: Date;
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            brand: {
                id: number;
                title: string;
            } | null;
            category: {
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
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
            weight: number;
            weightUnit: string;
            unit: string;
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
                title: string;
                thumb: string;
                price: number;
                discount: number;
                images: string[];
                createdAt: Date;
                updatedAt: Date;
                colorId: number | null;
                productId: number;
                sku: string;
            }[];
            brand: {
                id: number;
                title: string;
            } | null;
            category: {
                id: number;
                title: string;
                slug: string;
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
            title: string;
            slug: string;
            description: string;
            code: string;
            thumb: string;
            price: number;
            discount: number;
            sold: number;
            status: string;
            averageRating: number;
            ratingCount: number;
            tags: string[];
            images: string[];
            createdAt: Date;
            updatedAt: Date;
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
