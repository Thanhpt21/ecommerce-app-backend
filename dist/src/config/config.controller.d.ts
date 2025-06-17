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
            id: number;
            name: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            address: string | null;
            googlemap: string | null;
            facebook: string | null;
            zalo: string | null;
            instagram: string | null;
            tiktok: string | null;
            youtube: string | null;
            x: string | null;
            linkedin: string | null;
            logo: string | null;
        };
    }>;
    getOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            address: string | null;
            googlemap: string | null;
            facebook: string | null;
            zalo: string | null;
            instagram: string | null;
            tiktok: string | null;
            youtube: string | null;
            x: string | null;
            linkedin: string | null;
            logo: string | null;
        };
    }>;
    update(id: string, dto: UpdateConfigDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string | null;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            mobile: string | null;
            address: string | null;
            googlemap: string | null;
            facebook: string | null;
            zalo: string | null;
            instagram: string | null;
            tiktok: string | null;
            youtube: string | null;
            x: string | null;
            linkedin: string | null;
            logo: string | null;
        };
    }>;
}
