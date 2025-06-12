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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ContactService = class ContactService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
        const contact = await this.prisma.contact.create({
            data: {
                name: dto.name,
                email: dto.email,
                mobile: dto.mobile,
                comment: dto.comment,
                status: dto.status,
                type: dto.type,
            },
        });
        return {
            success: true,
            message: 'Contact created successfully',
            data: contact,
        };
    }
    async findAll(page = 1, limit = 10, search = '') {
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    { email: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    { comment: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            }
            : {};
        const [contacts, total] = await this.prisma.$transaction([
            this.prisma.contact.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contact.count({ where }),
        ]);
        return {
            success: true,
            message: total > 0 ? 'Contacts found successfully' : 'No contacts found',
            data: contacts,
            total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async findAllWithoutPagination(search = '') {
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    { email: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                    { comment: { contains: search, mode: client_1.Prisma.QueryMode.insensitive } },
                ],
            }
            : {};
        const contacts = await this.prisma.contact.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            message: contacts.length > 0 ? 'Contacts found successfully' : 'No contacts found',
            data: contacts,
            total: contacts.length,
        };
    }
    async findOne(id) {
        const contact = await this.prisma.contact.findUnique({ where: { id } });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        return {
            success: true,
            message: 'Contact found successfully',
            data: contact,
        };
    }
    async update(id, dto) {
        const existingContact = await this.prisma.contact.findUnique({ where: { id } });
        if (!existingContact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        const updatedContact = await this.prisma.contact.update({
            where: { id },
            data: dto,
        });
        return {
            success: true,
            message: 'Contact updated successfully',
            data: updatedContact,
        };
    }
    async remove(id) {
        const existingContact = await this.prisma.contact.findUnique({ where: { id } });
        if (!existingContact) {
            throw new common_1.NotFoundException(`Contact with ID ${id} not found`);
        }
        await this.prisma.contact.delete({ where: { id } });
        return {
            success: true,
            message: 'Contact removed successfully',
        };
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactService);
//# sourceMappingURL=contact.service.js.map