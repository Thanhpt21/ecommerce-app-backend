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
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: Prisma.JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: number): Promise<{
        success: boolean;
        message: string;
        data: ({
            category: {
                id: number;
                title: string;
                slug: string;
                image: string | null;
            };
            createdBy: {
                id: number;
                name: string;
                role: string;
                profilePicture: string | null;
            } | null;
        } & {
            id: number;
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: Prisma.JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
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
                id: number;
                title: string;
                slug: string;
                image: string | null;
            };
            createdBy: {
                id: number;
                name: string;
                role: string;
                profilePicture: string | null;
            } | null;
        } & {
            id: number;
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: Prisma.JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
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
                id: number;
                title: string;
                slug: string;
                image: string | null;
            };
            likes: {
                id: number;
            }[];
            dislikes: {
                id: number;
            }[];
            createdBy: {
                id: number;
                name: string;
                role: string;
                profilePicture: string | null;
            } | null;
            id: number;
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: Prisma.JsonValue;
            categoryId: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: number, dto: UpdateBlogDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: Prisma.JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
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
