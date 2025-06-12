import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
export declare class ColorController {
    private readonly colorService;
    constructor(colorService: ColorService);
    create(dto: CreateColorDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            code: string;
        };
    }>;
    getAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            code: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getAllWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            code: string;
        }[];
        total: number;
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            code: string;
        };
    }>;
    update(id: string, dto: UpdateColorDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            code: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
