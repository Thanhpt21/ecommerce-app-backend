import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';
import { GoogleUserPayload } from './interfaces/google-user-payload.interface';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    private emailService;
    private configService;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService, emailService: EmailService, configService: ConfigService);
    validateUser(email: string, password: string): Promise<{
        name: string;
        email: string;
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
    login(user: any): Promise<{
        success: boolean;
        message: string;
        access_token: string;
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
    }>;
    register(dto: CreateUserDto): Promise<{
        success: boolean;
        message: string;
        data: UserResponseDto;
    }>;
    forgotPassword(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    googleLogin(googleUser: GoogleUserPayload): Promise<{
        success: boolean;
        message: string;
        access_token: string;
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
            phoneNumber: string | null;
            gender: string | null;
            type_account: string;
            isActive: boolean;
        };
    }>;
}
