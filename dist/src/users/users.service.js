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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_response_dto_1 = require("./dto/user-response.dto");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let UsersService = class UsersService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async createUser(data) {
        const newUser = await this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role ?? 'customer',
                phoneNumber: data.phoneNumber ?? null,
                gender: data.gender ?? null,
                profilePicture: data.profilePicture ?? null,
                type_account: data.type_account ?? 'normal',
                isActive: data.isActive ?? true,
            },
        });
        return {
            success: true,
            message: 'User created successfully',
            data: newUser,
        };
    }
    async getUsers(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where: whereClause }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Users found successfully' : 'No users found',
            data: users.map(user => new user_response_dto_1.UserResponseDto(user)),
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return user;
    }
    async updateUser(id, data, file) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const updateData = { ...data };
        const normalize = (val) => {
            if (val === 'null')
                return null;
            if (val === 'true')
                return true;
            if (val === 'false')
                return false;
            return val;
        };
        updateData.phoneNumber = normalize(updateData.phoneNumber);
        updateData.gender = normalize(updateData.gender);
        updateData.role = normalize(updateData.role);
        updateData.type_account = normalize(updateData.type_account);
        updateData.isActive = normalize(updateData.isActive);
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        if (file) {
            const currentPublicId = (0, file_util_1.extractPublicId)(user.profilePicture);
            if (currentPublicId) {
                await this.uploadService.deleteImage(currentPublicId);
            }
            const { secure_url, public_id } = await this.uploadService.uploadImage(file, id, 'user');
            updateData.profilePicture = secure_url;
            updateData.profilePicturePublicId = public_id;
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        return {
            success: true,
            message: 'User updated successfully',
            data: new user_response_dto_1.UserResponseDto(updatedUser),
        };
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.profilePicturePublicId) {
            await this.uploadService.deleteImage(user.profilePicturePublicId);
        }
        await this.prisma.user.delete({ where: { id } });
        return {
            success: true,
            message: 'User deleted successfully',
        };
    }
    async getUserByEmail(email) {
        return this.prisma.user.findUnique({ where: { email } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, upload_service_1.UploadService])
], UsersService);
//# sourceMappingURL=users.service.js.map