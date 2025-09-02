import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
export declare class SizeController {
    private readonly sizeService;
    constructor(sizeService: SizeService);
    create(dto: CreateSizeDto): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        };
    }>;
    getAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getAllSizesWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        }[];
        total: number;
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        };
    }>;
    update(id: string, dto: UpdateSizeDto): Promise<{
        success: boolean;
        message: string;
        data: {
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
