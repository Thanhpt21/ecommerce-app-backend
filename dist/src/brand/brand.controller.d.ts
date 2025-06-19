import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
export declare class BrandController {
    private readonly brandService;
    constructor(brandService: BrandService);
    create(dto: CreateBrandDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        };
    }>;
    getBrands(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getAllBrandsWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        }[];
        total: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        };
    }>;
    update(id: string, dto: UpdateBrandDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
