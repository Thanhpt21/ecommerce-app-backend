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
exports.ConfigService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const upload_service_1 = require("../upload/upload.service");
const file_util_1 = require("../utils/file.util");
let ConfigService = class ConfigService {
    prisma;
    uploadService;
    constructor(prisma, uploadService) {
        this.prisma = prisma;
        this.uploadService = uploadService;
    }
    async create(dto, file) {
        const existing = await this.prisma.config.findFirst();
        if (existing)
            throw new common_1.BadRequestException('Config already exists');
        let logo = dto.logo;
        if (file) {
            const { secure_url } = await this.uploadService.uploadImage(file, 0, 'config');
            logo = secure_url;
        }
        const data = {
            ...dto,
            logo,
        };
        const config = await this.prisma.config.create({ data });
        return {
            success: true,
            message: 'Config created successfully',
            data: config,
        };
    }
    async findOne(id) {
        const config = await this.prisma.config.findUnique({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('Config not found');
        return {
            success: true,
            message: 'Config found successfully',
            data: config,
        };
    }
    async update(id, dto, file) {
        const config = await this.prisma.config.findUnique({ where: { id } });
        if (!config)
            throw new common_1.NotFoundException('Config not found');
        const updateData = { ...dto };
        if (file) {
            const currentPublicId = (0, file_util_1.extractPublicId)(config.logo);
            if (currentPublicId) {
                await this.uploadService.deleteImage(currentPublicId);
            }
            const { secure_url } = await this.uploadService.uploadImage(file, id, 'config');
            updateData.logo = secure_url;
        }
        const updated = await this.prisma.config.update({
            where: { id },
            data: updateData,
        });
        return {
            success: true,
            message: 'Config updated successfully',
            data: updated,
        };
    }
};
exports.ConfigService = ConfigService;
exports.ConfigService = ConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        upload_service_1.UploadService])
], ConfigService);
//# sourceMappingURL=config.service.js.map