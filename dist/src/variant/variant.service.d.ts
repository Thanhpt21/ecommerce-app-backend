import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantSizeDetail } from 'src/types/variant.type';
export declare class VariantService {
    private readonly prisma;
    private readonly uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
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
    findAll(productId: number, page?: number, limit?: number, search?: string): Promise<{
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
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getSizesByVariantId(variantId: number): Promise<{
        success: boolean;
        message: string;
        data: VariantSizeDetail[];
    }>;
}
