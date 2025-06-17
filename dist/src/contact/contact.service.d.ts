import { PrismaService } from 'prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateContactDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        };
    }>;
    findAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
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
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        }[];
        total: number;
    }>;
    findOne(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        };
    }>;
    update(id: number, dto: UpdateContactDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
