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
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: import("@prisma/client/runtime/library").JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string, categoryId?: string): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
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
    getAllBlogsWithoutPagination(search?: string, sortBy?: string): Promise<{
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
            content: import("@prisma/client/runtime/library").JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
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
            content: import("@prisma/client/runtime/library").JsonValue;
            categoryId: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    update(id: string, dto: UpdateBlogDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            title: string;
            slug: string;
            description: string;
            thumb: string | null;
            content: import("@prisma/client/runtime/library").JsonValue;
            categoryId: number;
            numberViews: number;
            isPublished: boolean;
            createdById: number | null;
            createdAt: Date;
            updatedAt: Date;
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
