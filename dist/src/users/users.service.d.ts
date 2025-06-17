import { PrismaService } from 'prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UploadService } from 'src/upload/upload.service';
export declare class UsersService {
    private prisma;
    private uploadService;
    constructor(prisma: PrismaService, uploadService: UploadService);
    createUser(data: {
        name: string;
        email: string;
        password: string;
        role?: string;
        phoneNumber?: string;
        gender?: string;
        profilePicture?: string | null;
        type_account?: string;
        isActive?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            name: string;
            email: string;
            password: string | null;
            role: string;
            phoneNumber: string | null;
            gender: string | null;
            profilePicture: string | null;
            profilePicturePublicId: string | null;
            isActive: boolean;
            type_account: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getUsers(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: UserResponseDto[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getUserById(id: number): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
        role: string;
        phoneNumber: string | null;
        gender: string | null;
        profilePicture: string | null;
        profilePicturePublicId: string | null;
        isActive: boolean;
        type_account: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: number, data: UpdateUserDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: UserResponseDto;
    }>;
    deleteUser(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getUserByEmail(email: string): Promise<{
        id: number;
        name: string;
        email: string;
        password: string | null;
        role: string;
        phoneNumber: string | null;
        gender: string | null;
        profilePicture: string | null;
        profilePicturePublicId: string | null;
        isActive: boolean;
        type_account: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
