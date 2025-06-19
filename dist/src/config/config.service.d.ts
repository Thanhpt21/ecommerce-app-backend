import { PrismaService } from 'prisma/prisma.service';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { UploadService } from 'src/upload/upload.service';
export declare class ConfigService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    create(dto: CreateConfigDto, file?: Express.Multer.File): Promise<{
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
        };
    }>;
    findOne(id: number): Promise<{
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
        };
    }>;
    update(id: number, dto: UpdateConfigDto, file?: Express.Multer.File): Promise<{
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
        };
    }>;
}
