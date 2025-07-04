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
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            parentId: number | null;
        };
    }>;
    getCategories(page?: number, limit?: number, search?: string): Promise<{
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
    getAllCategoriesWithoutPagination(search?: string): Promise<{
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
    findOne(id: string): Promise<{
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
    update(id: string, dto: UpdateCategoryDto, file: Express.Multer.File): Promise<{
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
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
