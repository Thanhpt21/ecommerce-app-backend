import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadService } from 'src/upload/upload.service';
export declare class UsersController {
    private readonly usersService;
    private readonly uploadService;
    constructor(usersService: UsersService, uploadService: UploadService);
    createUser(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            password: string | null;
            role: string;
            profilePicture: string | null;
            phoneNumber: string | null;
            gender: string | null;
            isActive: boolean;
            type_account: string;
            id: number;
            profilePicturePublicId: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getUsers(page?: number, limit?: number, search?: string): Promise<{
        success: boolean;
        message: string;
        data: import("./dto/user-response.dto").UserResponseDto[];
        total: number;
        page: number;
        pageCount: number;
    }>;
    getUserById(id: string): Promise<{
        name: string;
        email: string;
        password: string | null;
        role: string;
        profilePicture: string | null;
        phoneNumber: string | null;
        gender: string | null;
        isActive: boolean;
        type_account: string;
        id: number;
        profilePicturePublicId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: import("./dto/user-response.dto").UserResponseDto;
    }>;
    deleteImage(publicId: string): Promise<{
        message: string;
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
