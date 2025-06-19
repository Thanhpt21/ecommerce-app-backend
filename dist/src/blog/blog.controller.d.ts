import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    create(dto: CreateBlogDto, file: Express.Multer.File, req: any): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: string): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        })[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getAllBlogsWithoutPagination(search?: string, sortBy?: string): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        })[];
    }>;
    findBySlug(slug: string, req: any, isPreview?: string): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
            isPublished: boolean;
            createdById: number | null;
        };
    }>;
    update(id: string, dto: UpdateBlogDto, file: Express.Multer.File): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
            isPublished: boolean;
            numberViews: number;
            createdById: number | null;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    likeBlog(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    dislikeBlog(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
