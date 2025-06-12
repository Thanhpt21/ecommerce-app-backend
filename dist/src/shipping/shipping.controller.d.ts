import { ShippingService } from './shipping.service';
import { CreateShippingDto } from './dto/create-shipping.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    create(dto: CreateShippingDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            provinceName: string;
            fee: number;
        };
    }>;
    getAll(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            provinceName: string;
            fee: number;
        }[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getAllShippings(search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            provinceName: string;
            fee: number;
        }[];
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            provinceName: string;
            fee: number;
        };
    }>;
    update(id: string, dto: UpdateShippingDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            provinceName: string;
            fee: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
