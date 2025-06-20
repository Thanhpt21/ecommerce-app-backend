import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
export declare class ConfigController {
    private readonly configService;
    constructor(configService: ConfigService);
    create(dto: CreateConfigDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            facebook: string | null;
            name: string | null;
            email: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            address: string | null;
            googlemap: string | null;
            zalo: string | null;
            instagram: string | null;
            tiktok: string | null;
            youtube: string | null;
            x: string | null;
            linkedin: string | null;
            logo: string | null;
            pick_province: string | null;
            pick_district: string | null;
            pick_ward: string | null;
            pick_address: string | null;
        };
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            facebook: string | null;
            name: string | null;
            email: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            address: string | null;
            googlemap: string | null;
            zalo: string | null;
            instagram: string | null;
            tiktok: string | null;
            youtube: string | null;
            x: string | null;
            linkedin: string | null;
            logo: string | null;
            pick_province: string | null;
            pick_district: string | null;
            pick_ward: string | null;
            pick_address: string | null;
        };
    }>;
    update(id: string, dto: UpdateConfigDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            facebook: string | null;
            name: string | null;
            email: string | null;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            address: string | null;
            googlemap: string | null;
            zalo: string | null;
            instagram: string | null;
            tiktok: string | null;
            youtube: string | null;
            x: string | null;
            linkedin: string | null;
            logo: string | null;
            pick_province: string | null;
            pick_district: string | null;
            pick_ward: string | null;
            pick_address: string | null;
        };
    }>;
}
