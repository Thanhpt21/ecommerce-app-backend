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
exports.ShippingAddressService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let ShippingAddressService = class ShippingAddressService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        if (dto.isDefault) {
            await this.prisma.shippingAddress.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const address = await this.prisma.shippingAddress.create({
            data: {
                ...dto,
                userId,
            },
        });
        return {
            success: true,
            message: 'Shipping address created successfully',
            data: address,
        };
    }
    async findAll(userId) {
        const addresses = await this.prisma.shippingAddress.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
        return {
            success: true,
            message: 'Shipping addresses fetched successfully',
            data: addresses,
        };
    }
    async findByUserId(userId) {
        const addresses = await this.prisma.shippingAddress.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
        return {
            success: true,
            message: `Shipping addresses for user ${userId} fetched successfully`,
            data: addresses,
        };
    }
    async update(id, userId, dto) {
        const existing = await this.prisma.shippingAddress.findFirst({
            where: { id, userId },
        });
        if (!existing)
            throw new common_1.NotFoundException('Address not found');
        if (dto.isDefault === true) {
            await this.prisma.shippingAddress.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        const updated = await this.prisma.shippingAddress.update({
            where: { id },
            data: dto,
        });
        return {
            success: true,
            message: 'Address updated successfully',
            data: updated,
        };
    }
    async remove(id, userId) {
        const existing = await this.prisma.shippingAddress.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prisma.shippingAddress.delete({ where: { id } });
        return {
            success: true,
            message: 'Shipping address deleted successfully',
        };
    }
};
exports.ShippingAddressService = ShippingAddressService;
exports.ShippingAddressService = ShippingAddressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ShippingAddressService);
//# sourceMappingURL=shipping-address.service.js.map