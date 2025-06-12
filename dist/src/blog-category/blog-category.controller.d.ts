import { BlogCategoryService } from './blog-category.service';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
export declare class BlogCategoryController {
    private readonly blogCategoryService;
    constructor(blogCategoryService: BlogCategoryService);
    create(dto: CreateBlogCategoryDto, file: Express.Multer.File): Promise<{
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
    getAllBlogCategoriesWithoutPagination(search?: string): Promise<{
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
    }>;
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateBlogCategoryDto, file: Express.Multer.File): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
