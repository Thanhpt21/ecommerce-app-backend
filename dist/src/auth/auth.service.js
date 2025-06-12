"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
const user_response_dto_1 = require("../users/dto/user-response.dto");
const user_enums_1 = require("../users/enums/user.enums");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
const email_service_1 = require("../email/email.service");
const config_1 = require("@nestjs/config");
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    emailService;
    configService;
    constructor(usersService, jwtService, prisma, emailService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
        this.emailService = emailService;
        this.configService = configService;
    }
    async validateUser(email, password) {
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.password === null) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const { password, ...result } = user;
            return result;
        }
        else {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async login(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            success: true,
            message: 'Login successful',
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                type_account: user.type_account,
                isActive: user.isActive
            },
        };
    }
    async register(dto) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.createUser({
            ...dto,
            password: hashedPassword,
            role: dto.role || 'customer',
            type_account: user_enums_1.AccountType.NORMAL,
        });
        return {
            success: true,
            message: 'User registered successfully',
            data: new user_response_dto_1.UserResponseDto(user),
        };
    }
    async forgotPassword(email) {
        if (!email)
            throw new common_1.BadRequestException('Email is required');
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user)
            throw new common_1.NotFoundException('Email not found');
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expiresAt = addMinutes(new Date(), 30);
        await this.prisma.passwordResetToken.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const resetLink = `${frontendUrl}/vi/reset-password?token=${token}`;
        await this.emailService.sendResetPasswordEmail(email, resetLink);
        return {
            success: true,
            message: 'Reset link sent to your email',
        };
    }
    async resetPassword(token, newPassword) {
        const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });
        if (!record || record.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { email: record.email },
            data: { password: hashed },
        });
        await this.prisma.passwordResetToken.delete({ where: { token } });
        return {
            success: true,
            message: 'Password reset successfully',
        };
    }
    async googleLogin(googleUser) {
        const { email, name, photo } = googleUser;
        let user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    name,
                    profilePicture: photo,
                    isActive: true,
                    role: 'customer',
                    type_account: 'google',
                },
            });
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            success: true,
            message: 'Login with Google successful',
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phoneNumber: user.phoneNumber,
                gender: user.gender,
                type_account: user.type_account,
                isActive: user.isActive,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService,
        email_service_1.EmailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map