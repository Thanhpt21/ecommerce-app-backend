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
                title: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
            } | null;
            sizes: ({
                size: {
                    id: number;
                    title: string;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                variantId: number;
                sizeId: number;
                quantity: number;
            })[];
        } & {
            id: number;
            title: string;
            price: number;
            discount: number;
            thumb: string;
            images: string[];
            sku: string;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            colorId: number | null;
        }) | null;
    }>;
    findAll(productId: string, page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        data: {
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
            price: number;
            discount: number;
            thumb: string;
            images: string[];
            sku: string;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            colorId: number | null;
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
            title: string;
            price: number;
            discount: number;
            thumb: string;
            images: string[];
            sku: string;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            colorId: number | null;
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
                title: string;
                quantity: number;
                createdAt: Date;
                updatedAt: Date;
            }[];
            color: {
                id: number;
                title: string;
                createdAt: Date;
                updatedAt: Date;
                code: string;
            } | null;
            id: number;
            title: string;
            price: number;
            discount: number;
            thumb: string;
            images: string[];
            sku: string;
            createdAt: Date;
            updatedAt: Date;
            productId: number;
            colorId: number | null;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getVariantSizes(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("../types/variant.type").VariantSizeDetail[];
    }>;
}
