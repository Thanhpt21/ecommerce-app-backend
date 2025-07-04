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
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            parentId: number | null;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            subCategories: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                slug: string;
                parentId: number | null;
            }[];
        } & {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            parentId: number | null;
        })[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findAllWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            subCategories: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                slug: string;
                parentId: number | null;
            }[];
        } & {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            parentId: number | null;
        })[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            subCategories: {
                image: string | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                title: string;
                slug: string;
                parentId: number | null;
            }[];
        } & {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            parentId: number | null;
        };
    }>;
    update(id: number, dto: UpdateCategoryDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            parentId: number | null;
        };
    }>;
    private isDescendant;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
