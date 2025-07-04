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
exports.SizeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let SizeService = class SizeService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const size = await this.prisma.size.create({
            data: {
                title: dto.title,
            },
        });
        return {
            success: true,
            message: 'Size created successfully',
            data: size,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? { title: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const [sizes, total] = await this.prisma.$transaction([
            this.prisma.size.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.size.count({ where: whereClause }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Sizes found successfully' : 'No sizes found',
            data: sizes,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findAllWithoutPagination(search = '') {
        const whereClause = search
            ? { title: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const sizes = await this.prisma.size.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: sizes.length > 0 ? 'Sizes found successfully' : 'No sizes found',
            data: sizes,
            total: sizes.length,
        };
    }
    async findOne(id) {
        const size = await this.prisma.size.findUnique({ where: { id } });
        if (!size)
            throw new common_1.NotFoundException('Size not found');
        return {
            success: true,
            message: 'Size found successfully',
            data: size,
        };
    }
    async update(id, dto) {
        const size = await this.prisma.size.findUnique({ where: { id } });
        if (!size)
            throw new common_1.NotFoundException('Size not found');
        const updated = await this.prisma.size.update({
            where: { id },
            data: dto,
        });
        return {
            success: true,
            message: 'Size updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        const size = await this.prisma.size.findUnique({ where: { id } });
        if (!size)
            throw new common_1.NotFoundException('Size not found');
        await this.prisma.size.delete({ where: { id } });
        return {
            success: true,
            message: 'Size removed successfully',
        };
    }
};
exports.SizeService = SizeService;
exports.SizeService = SizeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SizeService);
//# sourceMappingURL=size.service.js.map