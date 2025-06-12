import { VariantService } from './variant.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
export declare class VariantController {
    private readonly variantService;
    constructor(variantService: VariantService);
    create(dto: CreateVariantDto, files: {
        thumb?: Express.Multer.File[];
        images?: Express.Multer.File[];
    }): Promise<{
        success: boolean;
        message: string;
        data: ({
            color: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                code: string;
            } | null;
            sizes: ({
                size: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                };
            } & {
                sizeId: number;
                variantId: number;
            })[];
        } & {
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
        }) | null;
    }>;
    findAll(productId: string, page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        data: {
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
        total: number;
        page: number;
        pageCount: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        data: {
            sizes: {
                id: number;
                title: string;
            }[];
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
        total: number;
        page: number;
        pageCount: number;
    }>;
    update(id: number, dto: UpdateVariantDto, files: {
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
            discount: number;
            price: number;
            colorId: number | null;
            thumb: string;
            images: string[];
            productId: number;
            sku: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getVariantSizes(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
        }[];
    }>;
}
