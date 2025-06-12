import { v2 as Cloudinary } from 'cloudinary';
export declare class UploadService {
    private cloudinary;
    constructor(cloudinary: typeof Cloudinary);
    uploadImage(file: Express.Multer.File, id: number, type?: 'user' | 'product' | 'blog' | 'category' | 'brand' | 'config' | 'store' | 'banner' | 'blog-category' | 'config' | 'variant'): Promise<{
        secure_url: string;
        public_id: string;
    }>;
    deleteImage(publicId: string): Promise<void>;
    deleteImageFromUrl(url: string): Promise<void>;
}
