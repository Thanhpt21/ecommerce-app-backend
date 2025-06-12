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
exports.ColorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ColorService = class ColorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const color = await this.prisma.color.create({
            data: {
                title: dto.title,
                code: dto.code,
            },
        });
        return {
            success: true,
            message: 'Color created successfully',
            data: color,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? { title: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const [colors, total] = await this.prisma.$transaction([
            this.prisma.color.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.color.count({ where: whereClause }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Colors found successfully' : 'No colors found',
            data: colors,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findAllWithoutPagination(search = '') {
        const whereClause = search
            ? { title: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const colors = await this.prisma.color.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: colors.length > 0 ? 'Colors found successfully' : 'No colors found',
            data: colors,
            total: colors.length,
        };
    }
    async findOne(id) {
        const color = await this.prisma.color.findUnique({ where: { id } });
        if (!color)
            throw new common_1.NotFoundException('Color not found');
        return {
            success: true,
            message: 'Color found successfully',
            data: color,
        };
    }
    async update(id, dto) {
        const color = await this.prisma.color.findUnique({ where: { id } });
        if (!color)
            throw new common_1.NotFoundException('Color not found');
        const updated = await this.prisma.color.update({
            where: { id },
            data: dto,
        });
        return {
            success: true,
            message: 'Color updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        const color = await this.prisma.color.findUnique({ where: { id } });
        if (!color)
            throw new common_1.NotFoundException('Color not found');
        await this.prisma.color.delete({ where: { id } });
        return {
            success: true,
            message: 'Color removed successfully',
        };
    }
};
exports.ColorService = ColorService;
exports.ColorService = ColorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ColorService);
//# sourceMappingURL=color.service.js.map