import { PrismaService } from 'prisma/prisma.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
export declare class SizeService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSizeDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
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
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        };
    }>;
    update(id: number, dto: UpdateSizeDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
