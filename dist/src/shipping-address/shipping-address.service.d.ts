import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { PrismaService } from 'prisma/prisma.service';
export declare class ShippingAddressService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateShippingAddressDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            fullName: string;
            phone: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            userId: number;
        };
    }>;
    findAll(userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            fullName: string;
            phone: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            userId: number;
        }[];
    }>;
    findByUserId(userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            fullName: string;
            phone: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            userId: number;
        }[];
    }>;
    update(id: number, userId: number, dto: UpdateShippingAddressDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            fullName: string;
            phone: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            userId: number;
        };
    }>;
    remove(id: number, userId: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
