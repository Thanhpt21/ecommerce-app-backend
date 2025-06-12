import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoreController {
    private readonly storeService;
    constructor(storeService: StoreService);
    create(dto: CreateStoreDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            link: string;
            mobile: string;
            address: string;
            iframe: string;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            link: string;
            mobile: string;
            address: string;
            iframe: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            link: string;
            mobile: string;
            address: string;
            iframe: string;
        };
    }>;
    update(id: string, dto: UpdateStoreDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            image: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            link: string;
            mobile: string;
            address: string;
            iframe: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
