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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("../users/dto/create-user.dto");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let AuthController = class AuthController {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async login(res, body) {
        const user = await this.authService.validateUser(body.email, body.password);
        const { access_token, user: userData, ...rest } = await this.authService.login(user);
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        res.cookie('accessToken', access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/',
        });
        return {
            ...rest,
            user: userData,
        };
    }
    async register(createUserDto) {
        return this.authService.register(createUserDto);
    }
    async forgotPassword(email) {
        return this.authService.forgotPassword(email);
    }
    async resetPassword(body) {
        return this.authService.resetPassword(body.token, body.newPassword);
    }
    getCurrentUser(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profilePicture: user.profilePicture,
            gender: user.gender,
            type_account: user.type_account,
            isActive: user.isActive,
        };
    }
    async logout(res) {
        res.clearCookie('accessToken', {
            path: '/',
        });
        return {
            success: true,
            message: 'Logout successful',
        };
    }
    async googleAuth() {
    }
    async googleAuthRedirect(req, res) {
        if (!req.user) {
            const frontendUrl = this.configService.get('FRONTEND_URL');
            return res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
        }
        const authResult = await this.authService.googleLogin(req.user);
        const frontendUrl = this.configService.get('FRONTEND_URL');
        const nodeEnv = this.configService.get('NODE_ENV');
        const isProduction = nodeEnv === 'production';
        res.cookie('accessToken', authResult.access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/',
        });
        res.redirect(`${frontendUrl}/vi`);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('current'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuth", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleAuthRedirect", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map