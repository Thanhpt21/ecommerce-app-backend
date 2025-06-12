import { ShippingAddressService } from './shipping-address.service';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
export declare class ShippingAddressController {
    private readonly shippingAddressService;
    constructor(shippingAddressService: ShippingAddressService);
    create(dto: CreateShippingAddressDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            userId: number;
            fullName: string;
            phone: string;
            address: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    findAll(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            userId: number;
            fullName: string;
            phone: string;
            address: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    findByUserIdQuery(userId: number): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            userId: number;
            fullName: string;
            phone: string;
            address: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    update(id: number, dto: UpdateShippingAddressDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            userId: number;
            fullName: string;
            phone: string;
            address: string;
            ward: string | null;
            district: string | null;
            province: string | null;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    remove(id: number, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
