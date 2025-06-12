import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
export declare class CategoryService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateCategoryDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findAllWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: number, dto: UpdateCategoryDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
