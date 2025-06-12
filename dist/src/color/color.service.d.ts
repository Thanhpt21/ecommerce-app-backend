import { PrismaService } from 'prisma/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
export declare class ColorService {
    private prisma;
    constructor(prisma: PrismaService);
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
    findAll(page?: number, limit?: number, search?: string): Promise<{
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
    findAllWithoutPagination(search?: string): Promise<{
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
    findOne(id: number): Promise<{
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
    update(id: number, dto: UpdateColorDto): Promise<{
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
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
