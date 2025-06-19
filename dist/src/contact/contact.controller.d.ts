import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(dto: CreateContactDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        };
    }>;
    getAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: number;
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
    getAllWithoutPagination(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        }[];
        total: number;
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        };
    }>;
    update(id: string, dto: UpdateContactDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            status: string;
            comment: string;
            type: string;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
