import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadAvatar(file: Express.Multer.File, req: any): Promise<{
        message: string;
        imageUrl: {
            secure_url: string;
            public_id: string;
        };
    }>;
}
