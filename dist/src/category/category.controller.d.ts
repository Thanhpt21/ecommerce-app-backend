import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(dto: CreateCategoryDto, file: Express.Multer.File): Promise<{
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
    getCategories(page?: number, limit?: number, search?: string): Promise<{
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
    getAllCategoriesWithoutPagination(search?: string): Promise<{
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
    update(id: string, dto: UpdateCategoryDto, file: Express.Multer.File): Promise<{
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
