import { PrismaService } from 'prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { UploadService } from 'src/upload/upload.service';
import { Prisma } from '@prisma/client';
export declare class BlogService {
    private readonly prisma;
    private readonly uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateBlogDto, userId: number, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            categoryId: number;
            thumb: string | null;
            content: Prisma.JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: number): Promise<{
        success: boolean;
        message: string;
        data: ({
            category: {
                image: string | null;
                id: number;
                title: string;
                slug: string;
            };
            createdBy: {
                name: string;
                role: string;
                profilePicture: string | null;
                id: number;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            categoryId: number;
            thumb: string | null;
            content: Prisma.JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        })[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findAllWithoutPagination(search?: string, sortBy?: string): Promise<{
        success: boolean;
        message: string;
        data: ({
            category: {
                image: string | null;
                id: number;
                title: string;
                slug: string;
            };
            createdBy: {
                name: string;
                role: string;
                profilePicture: string | null;
                id: number;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            categoryId: number;
            thumb: string | null;
            content: Prisma.JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        })[];
    }>;
    findBySlug(slug: string, isPreview?: boolean, userId?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            numberViews: number;
            likesCount: number;
            dislikesCount: number;
            hasLiked: boolean;
            hasDisliked: boolean;
            category: {
                image: string | null;
                id: number;
                title: string;
                slug: string;
            };
            likes: {
                id: number;
            }[];
            dislikes: {
                id: number;
            }[];
            createdBy: {
                name: string;
                role: string;
                profilePicture: string | null;
                id: number;
            } | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            categoryId: number;
            thumb: string | null;
            content: Prisma.JsonValue;
            isPublished: boolean;
            createdById: number | null;
        };
    }>;
    update(id: number, dto: UpdateBlogDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            description: string;
            categoryId: number;
            thumb: string | null;
            content: Prisma.JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    likeBlog(blogId: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    dislikeBlog(blogId: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
