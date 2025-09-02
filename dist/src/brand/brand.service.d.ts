import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
export declare class BrandService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateBrandDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    findAllWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        };
    }>;
    update(id: number, dto: UpdateBrandDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            id: number;
            title: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
