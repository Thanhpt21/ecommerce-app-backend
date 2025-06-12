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
exports.ShippingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ShippingService = class ShippingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const shipping = await this.prisma.shipping.create({
            data: {
                provinceName: dto.provinceName,
                fee: dto.fee,
            },
        });
        return {
            success: true,
            message: 'Shipping created successfully',
            data: shipping,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const whereClause = search
            ? { provinceName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const [shippings, total] = await this.prisma.$transaction([
            this.prisma.shipping.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.shipping.count({ where: whereClause }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Shippings found successfully' : 'No shippings found',
            data: shippings,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findAllWithoutPagination(search = '') {
        const whereClause = search
            ? { provinceName: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } }
            : {};
        const shippings = await this.prisma.shipping.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: shippings.length > 0 ? 'Shippings found successfully' : 'No shippings found',
            data: shippings,
        };
    }
    async findOne(id) {
        const shipping = await this.prisma.shipping.findUnique({ where: { id } });
        if (!shipping)
            throw new common_1.NotFoundException('Shipping not found');
        return {
            success: true,
            message: 'Shipping found successfully',
            data: shipping,
        };
    }
    async update(id, dto) {
        const shipping = await this.prisma.shipping.findUnique({ where: { id } });
        if (!shipping)
            throw new common_1.NotFoundException('Shipping not found');
        const updated = await this.prisma.shipping.update({
            where: { id },
            data: dto,
        });
        return {
            success: true,
            message: 'Shipping updated successfully',
            data: updated,
        };
    }
    async remove(id) {
        const shipping = await this.prisma.shipping.findUnique({ where: { id } });
        if (!shipping)
            throw new common_1.NotFoundException('Shipping not found');
        await this.prisma.shipping.delete({ where: { id } });
        return {
            success: true,
            message: 'Shipping removed successfully',
        };
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map