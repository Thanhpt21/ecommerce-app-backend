import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    login(res: Response, body: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: any;
            name: any;
            email: any;
            role: any;
            phoneNumber: any;
            gender: any;
            type_account: any;
            isActive: any;
        };
        success: boolean;
        message: string;
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        data: import("../users/dto/user-response.dto").UserResponseDto;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    getCurrentUser(user: any): {
        id: any;
        name: any;
        email: any;
        role: any;
        phoneNumber: any;
        profilePicture: any;
        gender: any;
        type_account: any;
        isActive: any;
    };
    logout(res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    googleAuth(): Promise<void>;
    googleAuthRedirect(req: Request, res: Response): Promise<void>;
}
