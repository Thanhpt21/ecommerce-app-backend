import { PrismaService } from 'prisma/prisma.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { UploadService } from 'src/upload/upload.service';
export declare class BlogCategoryService {
    private readonly prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateBlogCategoryDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            title: string;
            slug: string;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            title: string;
            slug: string;
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
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            title: string;
            slug: string;
        }[];
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            title: string;
            slug: string;
        };
    }>;
    update(id: number, dto: UpdateBlogCategoryDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            image: string | null;
            title: string;
            slug: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
