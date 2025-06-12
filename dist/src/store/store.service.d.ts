import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
export declare class StoreService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateStoreDto, file?: Express.Multer.File): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, dto: UpdateStoreDto, file?: Express.Multer.File): Promise<{
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
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
